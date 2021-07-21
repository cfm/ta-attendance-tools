<template>
  <v-data-table
    v-if="members.length > 0"
    v-model="present"
    dense
    disable-pagination
    :headers="headers"
    hide-default-footer
    :items="members"
    item-key="Id"
    show-select
  >
  </v-data-table>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'TakeAttendance',

  data: () => {
    return {
      present: [],
      EXCLUDE_HEADERS: ['Id', 'attributes'],
    };
  },

  computed: {
    ...mapState({
      members: (state) => state.memberList,
    }),
    _headers() {
      return Object.keys(this.members[0]).map((k) => {
        return {
          text: k,
          value: k,
        };
      });
    },
    headers() {
      if (this._headers == undefined) return [];
      return this._headers.filter(
        (k) => !this.EXCLUDE_HEADERS.includes(k.text),
      );
    },
  },

  methods: {
    ...mapMutations(['replacePresentList']),
  },

  watch: {
    present(val) {
      this.replacePresentList(val.map((member) => member.Id));
    },
  },
};
</script>
