<template>
  <v-stepper>
    <v-stepper-header>
      <v-stepper-step step="1" :editable="haveMemberList">
        Take attendance
      </v-stepper-step>
      <v-stepper-step step="2" :editable="haveAttendance">
        Assign proxies
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <TakeAttendance />
      </v-stepper-content>
      <v-stepper-content step="2">
        <AssignProxies />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapState } from 'vuex';

import AssignProxies from './AssignProxies';
import TakeAttendance from './TakeAttendance';

export default {
  name: 'Wizard',

  components: {
    AssignProxies,
    TakeAttendance,
  },

  computed: {
    ...mapState({
      members: (state) => state.memberList,
      present: (state) => state.presentList,
    }),

    haveAttendance() {
      return this.present.length > 0;
    },
    haveMemberList() {
      return this.members.length > 0;
    },
  },
};
</script>
