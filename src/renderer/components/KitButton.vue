<template>
  <button class="bg-blue hover:bg-blue-100 px-3 pb-1.5 pt-1 text-white text-sm mx-1 focus:outline-none focus:ring-2" :class="rounded"><slot></slot></button>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "KitButton",
  computed: mapGetters(["rounded"])
};
</script>

<style></style>
