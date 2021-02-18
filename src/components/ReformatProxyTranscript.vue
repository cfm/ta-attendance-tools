<template>
  <v-container>
    <v-form>
      <v-textarea
        v-model="transcript"
        placeholder="paste attendance transcript here"
      ></v-textarea>
      <v-sheet>
        <ul>
          <li
            v-for="[holder, assignments] in Object.entries(proxies)"
            :key="holder"
          >
            {{ holder }} holds {{ assignments.length }} proxy/ies for:
            <span v-for="(assignment, key) in assignments" :key="assignment">
              {{ assignment
              }}<span v-if="key + 1 != assignments.length">,</span>
            </span>
          </li>
        </ul>
      </v-sheet>
    </v-form>
  </v-container>
</template>

<script>
const _ = require("lodash");

export default {
  name: "ReformatProxyTranscript",

  data: () => ({
    transcript: "",
  }),

  computed: {
    _proxies: function () {
      const lines = this.transcript.split("\n");
      let proxies = {};
      lines.forEach((line) => {
        if (line.includes("proxy")) {
          let [represented, holder] = line.split("proxy");
          represented = represented.trim();
          holder = holder.trim();

          if (proxies[holder]) {
            proxies[holder].push(represented);
          } else {
            proxies[holder] = [represented];
          }
        }
      });
      return proxies;
    },
    proxies: function () {
      // per <https://github.com/lodash/lodash/issues/1459#issuecomment-253969771>
      return _(this._proxies).toPairs().sortBy(0).fromPairs().value();
    },
  },
};
</script>
