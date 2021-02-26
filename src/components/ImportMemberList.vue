<template>
  <v-container>
    <v-form>
      <v-file-input
        accept="text/csv"
        label="upload member list (.csv)"
        v-model="file"
      />
    </v-form>
    <code v-if="fileData.errors && fileData.errors.length > 0">
      {{ fileData.errors }}
    </code>
  </v-container>
</template>

<script>
import Papa from "papaparse";
import { mapMutations } from "vuex";

// Adapted from <https://github.com/mholt/PapaParse/issues/752#issuecomment-567294386>
const papaPromise = (file) =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: function (results) {
        resolve(results);
      },
      error: function (error) {
        reject(error);
      },
    });
  });

const columns = [
  "lastName",
  "firstName",
  "padding",
  "lastModified",
  "proxy1",
  "proxy2",
  "proxy3",
  "proxy4",
  "proxy5",
  "proxy6",
  "proxy7",
  "proxy8",
  "proxy9",
  "proxy10",
];

export default {
  name: "ImportMemberList",

  data: () => {
    return {
      file: null,
      fileData: {},
    };
  },

  methods: {
    ...mapMutations(["replaceMemberList"]),
  },

  watch: {
    file: async function () {
      this.fileData = await papaPromise(this.file);

      if (this.fileData.data == undefined) return [];
      this.replaceMemberList(
        this.fileData.data.map((row) => {
          return Object.fromEntries(
            row.map((val, idx) => {
              return [columns[idx], val];
            })
          );
        })
      );
    },
  },
};
</script>
