<template>
  <router-link :to="{ path: '/artisan/command/' + commandName }" class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6" :alt="description">{{ commandName }}</router-link>
</template>

<script>
export default {
  name: "CommandListItem",
  props: ["commandName", "description"]
};
</script>

<style scoped>
.router-link-exact-active {
  @apply bg-gray-300;
}
</style>
