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
    <v-stepper-items> </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  name: "Wizard",

  data: () => {
    return {
      haveAttendance: false,
      haveMemberList: false,
    };
  },
};
</script>
