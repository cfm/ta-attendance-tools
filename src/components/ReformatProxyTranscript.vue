<template>
  <v-container>
    <v-form>
        <v-textarea v-model="input"></v-textarea>
        <v-btn @click="requestReformat">Reformat</v-btn>
        <v-sheet>{{ output }}</v-sheet>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    name: 'ReformatProxyTranscript',

    data: () => ({
        input: '',
        output: '',
    }),

    methods: {
        async requestReformat() {
            let res = await fetch('/.netlify/functions/reformat-proxy-transcript', {
                method: 'POST',
                body: JSON.stringify({transcript: this.input}),
            });
            this.output = (await res.json()).transcript;
        },
    },

  }
</script>
