<template>
  <div>
    <div class="flex justify-between">
      <h1 class="font-mono text-xl">{{ command.name }}</h1>
      <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2" @click="getOutput">Run</button>
    </div>
    <p class="mt-5 mb-3 text-base">{{ command.description }}</p>
    <div class="h-px bg-gray-300"></div>
    <div v-if="argumentsInit.length > 0">
      <h2 class="text-gray-800 font-bold text-base mt-4">Arguments</h2>
      <argument-input v-for="argument in argumentsInit" :key="argument.name" :field="argument" v-model="argument.value"></argument-input>
    </div>
    <div v-if="optionsInit.length > 0">
      <h2 class="text-gray-800 font-bold text-base mt-4">Options</h2>
      <option-input v-for="option in optionsInit" :key="option.name" :field="option" v-model="option.value"></option-input>
    </div>
    <div>
      <h2 class="text-gray-800 font-bold text-base mt-4">Terminal</h2>
      <div id="terminal" class="font-mono text-sm mt-3">
        <span>→</span> <span class="text-cyan">{{ appName }}</span> <span class="text-purple">›</span> <span>php artisan {{ fullCommand }}</span>
        <br />
        <pre v-html="output" class="max-h-64 overflow-y-scroll pb-4 select-text"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import ArgumentInput from "@/components/ArgumentInput.vue";
import OptionInput from "@/components/OptionInput.vue";
import { mapState } from "vuex";
import Convert from "ansi-to-html";
export default {
  name: "Command",
  components: { ArgumentInput, OptionInput },
  props: ["name"],
  data() {
    return {
      optionsInit: {},
      argumentsInit: {},
      output: "",
      convert: new Convert({ newline: true, fg: "#222222", bg: "#fff" })
    };
  },
  computed: {
    ...mapState({ appName: "name" }),
    getName() {
      return this.name;
    },
    command() {
      return this.$store.state.project.commands.find(command => command.name == this.name);
    },
    getArguments() {
      return Object.keys(this.command.definition.arguments)
        .map(argument => this.command.definition.arguments[argument])
        .map(option => Object.assign({}, option, { value: "" }));
    },
    getOptions() {
      const remove = ["--help", "--quiet", "--verbose", "--version", "--ansi", "--no-ansi", "--no-interaction", "--env"];
      return Object.keys(this.command.definition.options)
        .map(option => this.command.definition.options[option])
        .filter(option => !remove.includes(option.name))
        .map(option => Object.assign({}, option, { value: option.accept_value ? "" : option.default }));
    },
    fullCommand() {
      let argumentsCommand = "",
        optionsCommand = "";
      if (this.argumentsInit.length > 0) {
        argumentsCommand = this.argumentsInit.reduce((tempCommand, argument) => {
          if (argument.value == "") {
            return `${tempCommand}`;
          }
          return `${tempCommand} ${argument.value}`;
        }, "");
      }
      if (this.optionsInit.length > 0) {
        optionsCommand = this.optionsInit.reduce((tempCommand, option) => {
          if (option.value == "" || option.value == false) {
            return `${tempCommand}`;
          }
          return `${tempCommand} ${option.name}${option.accept_value ? " " + option.value : ""}`;
        }, "");
      }
      return this.command.name + argumentsCommand + optionsCommand;
    }
  },
  methods: {
    getOutput() {
      this.output = this.convert.toHtml(this.$store.getters.artisan(this.fullCommand));
      document.getElementById("terminal").scrollIntoView();
    }
  },
  updated() {
    this.argumentsInit = this.getArguments;
    this.optionsInit = this.getOptions;
    this.$store.commit("updateLastArtisan", this.getName);
  },
  mounted() {
    this.argumentsInit = this.getArguments;
    this.optionsInit = this.getOptions;
    this.$store.commit("updateLastArtisan", this.getName);
  }
};
</script>

<style>
::selection {
  background: #e4e4e4;
}
</style>
