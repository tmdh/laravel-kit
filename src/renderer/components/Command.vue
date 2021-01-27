<template>
  <div>
    <div class="flex justify-between">
      <h1 class="font-mono text-xl">{{ command.name }}</h1>
      <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2">Run</button>
    </div>
    <p class="mt-5 mb-3 text-base">{{ command.description }}</p>
    <div class="h-px bg-gray-300"></div>
    <div v-if="getArguments.length > 0">
      <h2 class="text-gray-800 font-bold text-base mt-4">Arguments</h2>
      <argument-input v-for="argument in getArguments" :key="argument.name" :field="argument"></argument-input>
    </div>
    <div v-if="getOptions.length > 0">
      <h2 class="text-gray-800 font-bold text-base mt-4">Options</h2>
      <option-input v-for="option in getOptions" :key="option.name" :field="option"></option-input>
    </div>
  </div>
</template>

<script>
import ArgumentInput from "@/components/ArgumentInput.vue";
import OptionInput from "@/components/OptionInput.vue";
export default {
  name: "Command",
  components: { ArgumentInput, OptionInput },
  props: ["name"],
  computed: {
    command() {
      return this.$store.state.project.commands.find(command => command.name == this.name);
    },
    getArguments() {
      return Object.keys(this.command.definition.arguments).map(argument => this.command.definition.arguments[argument]);
    },
    getOptions() {
      const remove = ["--help", "--quiet", "--verbose", "--version", "--ansi", "--no-ansi", "--no-interaction", "--env"];
      return Object.keys(this.command.definition.options)
        .map(option => this.command.definition.options[option])
        .filter(option => !remove.includes(option.name));
    }
  }
};
</script>

<style></style>
