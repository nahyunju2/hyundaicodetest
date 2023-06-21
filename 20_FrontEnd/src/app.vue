<template>
    <q-layout view="hHh lpR fFf">
      <q-ajax-bar ref="bar" position="top" size="5px" />
      <router-view :key="route.path" />
    </q-layout>
</template>

<script setup lang="ts">
const route = useRoute();

</script>