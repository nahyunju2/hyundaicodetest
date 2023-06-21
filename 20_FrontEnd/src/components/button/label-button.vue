<template>
    <q-btn flat :label="buttonTxt" color="white" style="margin-left: 5px;" />
  </template>
  
  <script lang="ts">
  
  export default {
    name: "LebelButton",
    props: {
      buttonTxt: { type: String, default: "" }
    }
  }
  </script>
  