<template>
  <v-app>
    <v-main>
      <Login v-if="loginRequired" />
      <Loading v-if="syncInProgress" />
      <v-snackbar v-model="showConnectedToSalesforce" color="success">
        Connected to Salesforce
      </v-snackbar>
      <v-snackbar v-model="showSyncError" color="error">
        {{ lastSyncError }}
      </v-snackbar>
      <v-app-bar>
        <v-chip @click="sync()">
          <v-avatar><v-icon>mdi-table-refresh</v-icon></v-avatar>
          <template v-if="lastSync">
            Roster updated&nbsp;
            <timeago :datetime="lastSync" />
          </template>
          <template v-else> Refresh </template>
        </v-chip>
        <v-chip :ripple="false">
          <v-avatar>{{ members.length }}</v-avatar> members
        </v-chip>
        <v-chip :ripple="false">
          <v-avatar>{{ present.length }}</v-avatar> present
        </v-chip>
      </v-app-bar>
      <Wizard />
    </v-main>
  </v-app>
</template>

<script>
import jsforce from 'jsforce';
import { mapMutations, mapState } from 'vuex';

import { FIELDS } from '@/constants';
import Loading from './components/Loading';
import Login from './components/Login';
import Wizard from './components/Wizard';

export default {
  name: 'App',

  components: {
    Loading,
    Login,
    Wizard,
  },

  data() {
    return {
      conn: null,
      lastSync: null,
      lastSyncError: false,
      syncInProgress: false,

      showConnectedToSalesforce: false,
      showSyncError: false,
    };
  },

  computed: {
    ...mapState({
      members: (state) => state.memberList,
      present: (state) => state.presentList,
    }),

    loginRequired: function () {
      return this.conn == null;
    },
  },

  watch: {
    conn: function (conn) {
      if (conn) this.showConnectedToSalesforce = true;
    },
    lastSyncError: function () {
      this.showSyncError = true;
    },
  },

  async mounted() {
    jsforce.browser.init({
      clientId: process.env.VUE_APP_SALESFORCE_CLIENT_ID,
      clientSecret: process.env.VUE_APP_SALESFORCE_CLIENT_SECRET,
      redirectUri: process.env.VUE_APP_SALESFORCE_REDIRECT_URI,
    });
    jsforce.browser.on('connect', (conn) => {
      console.log('Connected to Salesforce');
      this.conn = conn;
    });
  },

  methods: {
    ...mapMutations(['replaceMemberList']),
    sync() {
      this.syncInProgress = true;
      this.conn.query(
        `SELECT ${FIELDS.join(
          ', ',
        )} FROM Contact WHERE Is_Current_TA_Member__c = true`,
        (err, res) => {
          this.syncInProgress = false;
          if (err) {
            this.lastSyncError = err;
            return;
          }
          this.lastSync = Date.now();
          console.log(res);
        },
      );
    },
  },
};
</script>
