<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>

    <v-main>
      <ReformatProxyTranscript />
    </v-main>
  </v-app>
</template>

<script>
import ReformatProxyTranscript from './components/ReformatProxyTranscript';

export default {
  name: 'App',

  components: {
    ReformatProxyTranscript,
  },

  data: () => ({
    //
  }),
};
</script>
