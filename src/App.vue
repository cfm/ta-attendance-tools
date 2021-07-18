<template>
  <v-app>
    <v-main>
      <Login v-if="loginRequired" />
      <v-snackbar v-model="showConnectedToSalesforce" color="success">
        Connected to Salesforce
      </v-snackbar>
      <v-app-bar>
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
import { mapState } from 'vuex';

import Login from './components/Login';
import Wizard from './components/Wizard';

export default {
  name: 'App',

  components: {
    Login,
    Wizard,
  },

  data() {
    return {
      conn: null,

      showConnectedToSalesforce: false,
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
};
</script>
