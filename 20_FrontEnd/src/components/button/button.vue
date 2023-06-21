<template>
  <q-btn :label="buttonTxt" color="white" :text-color="buttonType" style="margin-left: 5px;" />
</template>

<script lang="ts">

enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Accent = 'accent'
}

export default {
  name: "CommonButton",
  props: {
    buttonTxt: { type: String, default: "" },
    buttonType: { type: String , default: ButtonType.Primary }
  }
}
</script>
