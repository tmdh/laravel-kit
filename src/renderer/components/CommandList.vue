<template>
  <div class="flex flex-col">
    <command-list-item v-for="command in searchResults" :key="command.name" :commandName="command.name" :alt="command.description"></command-list-item>
  </div>
</template>

<script>
import CommandListItem from "@/components/CommandListItem.vue";
export default {
  name: "CommandList",
  props: ["searchResults"],
  components: { CommandListItem }
};
</script>

<style></style>
