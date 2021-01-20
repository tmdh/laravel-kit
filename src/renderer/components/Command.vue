<template>
  <div>
    <div class="flex justify-between">
      <h1 class="font-mono text-xl">{{ command.name }}</h1>
      <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2">Run</button>
    </div>
    <p class="mt-5 mb-3 text-base">{{ command.description }}</p>
    <div class="h-px bg-gray-300"></div>
    <div v-if="argumentsLength > 0">
      <h2 class="text-gray-800 font-bold text-base mt-4">Arguments</h2>
      <div class="flex flex-row py-2">
        <div class="w-64">
          <span class="text-sm text-gray-900">name</span>
        </div>
        <div class="flex flex-col">
          <input type="text" class="h-7 w-72 border-input border-gray-300 border rounded px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500" />
          <span class="text-xs text-gray-600 mt-1">The name of the class</span>
        </div>
      </div>
    </div>
    <h2 class="text-gray-800 font-bold text-base mt-4">Options</h2>
    <div class="flex flex-row py-2">
      <div class="w-64">
        <span class="text-sm text-gray-900">api</span>
      </div>
      <div class="flex flex-row items-center">
        <input type="checkbox" class="w-4 h-4 rounded-md text-blue-100 focus:ring-0 hover:text-blue hover:border-gray-900" id="api" />
        <label class="ml-2 text-sm text-gray-600" for="api">Exclude the create and edit methods from the controller.</label>
      </div>
    </div>
    <div class="flex flex-row py-2">
      <div class="w-64">
        <span class="text-sm text-gray-900">force</span>
      </div>
      <div class="flex flex-row items-center">
        <input type="checkbox" class="w-4 h-4 rounded-md text-blue-100 focus:ring-0 hover:text-blue  hover:border-gray-900" id="force" />
        <label class="ml-2 text-sm text-gray-600" for="force">Create the class even if the controller already exists</label>
      </div>
    </div>
    <div class="flex flex-row py-2">
      <div class="w-64">
        <span class="text-sm text-gray-900">invokable</span>
      </div>
      <div class="flex flex-row items-center">
        <input type="checkbox" class="w-4 h-4 rounded-md text-blue-100 focus:ring-0 hover:text-blue  hover:border-gray-900" id="invokable" />
        <label class="ml-2 text-sm text-gray-600" for="invokable">Generate a single method, invokable controller class.</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Command",
  props: ["name"],
  computed: {
    command() {
      return this.$store.getters.getCommand(this.name);
    },
    arguments() {
      let args = this.command.definition.arguments;
      return Object.keys(args).map(arg => args[arg]);
    },
    argumentsLength() {
      return this.arguments.length;
    }
  }
};
</script>

<style></style>
