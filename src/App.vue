<template>
  <v-app>
    <v-main>
      <v-app-bar>
        <v-chip :ripple="false">
          <v-avatar>{{ members.length }}</v-avatar> members
        </v-chip>
      </v-app-bar>
      <Wizard />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

import Wizard from "./components/Wizard";

export default {
  name: "App",

  components: {
    Wizard,
  },

  computed: {
    ...mapState({
      members: (state) => state.memberList,
    }),
  },
};
</script>
