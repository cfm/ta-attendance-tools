<template>
  <v-stepper>
    <v-stepper-header>
      <v-stepper-step step="1" editable>Import members</v-stepper-step>
      <v-stepper-step step="2" :editable="haveMemberList"
        >Take attendance</v-stepper-step
      >
      <v-stepper-step step="3" :editable="haveAttendance"
        >Assign proxies</v-stepper-step
      >
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <ImportMemberList />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapState } from "vuex";

import ImportMemberList from "./ImportMemberList";

export default {
  name: "Wizard",

  components: {
    ImportMemberList,
  },

  computed: {
    ...mapState({
      members: (state) => state.memberList,
    }),

    haveAttendance: () => false,
    haveMemberList() {
      return this.members.length > 0;
    },
  },
};
</script>
