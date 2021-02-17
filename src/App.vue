<template>
  <v-app>
    <v-main>
      <ReformatProxyTranscript />
    </v-main>
  </v-app>
</template>

<script>
import ReformatProxyTranscript from "./components/ReformatProxyTranscript";

export default {
  name: "App",

  components: {
    ReformatProxyTranscript,
  },

  data: () => ({
    //
  }),
};
</script>
