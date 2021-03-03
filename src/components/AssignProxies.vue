<template>
  <v-container>
    <ul>
      <li
        v-for="[holder, assignments] in Object.entries(proxies)"
        :key="holder"
      >
        {{ holder }} holds {{ assignments.length }} proxy/ies for:
        <span v-for="(assignment, key) in assignments" :key="assignment">
          {{ assignment }}<span v-if="key + 1 != assignments.length">,</span>
        </span>
      </li>
    </ul>
    <v-btn @click="doAssignProxies">Assign Proxies</v-btn>
    <v-sheet>{{ output }}</v-sheet>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

const _ = require("lodash");

export default {
  name: "AssignProxies",

  data: () => ({
    transcript: "",
    output: "",
  }),

  computed: {
    ...mapState({
      memberList: (state) => state.memberList,
      presentList: (state) => state.presentList,
    }),
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

  methods: {
    async doAssignProxies() {
      let res = await fetch("/.netlify/functions/assign-proxies", {
        method: "POST",
        body: JSON.stringify({
          memberList: this.memberList,
          presentList: this.presentList,
        }),
      });
      this.output = await res.json();
    },
  },
};
</script>
