<template>
  <div class="flex-1">
    <div class="flex justify-between">
      <h1 class="font-mono text-xl">{{ command.name }}</h1>
      <kit-button @click.native="getOutputAsync">Run</kit-button>
    </div>
    <p class="mt-5 mb-3 text-base">{{ command.description }}</p>
    <div class="h-px bg-gray-300"></div>
    <div v-if="argumentsInit.length > 0">
      <h2 class="text-gray-800 font-bold text-base mt-4 dark:text-gray-200">Arguments</h2>
      <argument-input v-for="argument in argumentsInit" :key="argument.name" :field="argument" v-model="argument.value"></argument-input>
    </div>
    <div v-if="optionsInit.length > 0">
      <h2 class="text-gray-800 font-bold text-base mt-4 dark:text-gray-200">Options</h2>
      <option-input v-for="option in optionsInit" :key="option.name" :field="option" v-model="option.value"></option-input>
    </div>
    <div>
      <h2 class="text-gray-800 font-bold text-base mt-4 dark:text-gray-200">Terminal</h2>
      <div class="flex flex-row items-center mt-2" v-if="routes.isJSON">
        <input type="checkbox" class="input-checkbox" id="routeTable" :checked="routeTable" v-model="routeTable" />
        <label class="ml-2 text-sm text-gray-600 dark:text-white" for="routeTable">Show JSON as table</label>
      </div>
      <div ref="terminal" class="font-mono text-sm mt-3 flex flex-col">
        <div class="select-text">
          <span>→</span> <span class="text-terminal-cyan dark:text-terminal-d-cyan">{{ appName }}</span> <span class="text-terminal-purple dark:text-terminal-d-purple">›</span>
          <span class="text-terminal-green dark:text-terminal-d-green">php</span>
          <span>artisan {{ fullCommand }}</span>
        </div>
        <pre class="max-h-64 overflow-y-auto pb-4 select-text whitespace-pre-wrap break-all" v-html="output"></pre>
      </div>
      <div ref="terminal-end"></div>
      <route-table v-if="routes.isJSON && routeTable" :routes="routes" :key="output"></route-table>
    </div>
  </div>
</template>
<script>
import KitButton from "@/components/KitButton.vue";
import ArgumentInput from "@/components/ArgumentInput.vue";
import OptionInput from "@/components/OptionInput.vue";
import RouteTable from "@/components/RouteTable.vue";
import { mapState } from "vuex";
import Anser from "anser";
import { exec } from "child_process";

export default {
  name: "Command",
  components: { KitButton, ArgumentInput, OptionInput, RouteTable },
  props: ["name"],
  data() {
    return {
      optionsInit: {},
      argumentsInit: {},
      output: "",
      routeTable: false
    };
  },
  computed: {
    ...mapState({ appName: "name" }),
    getName() {
      return this.name;
    },
    command() {
      return this.$store.state.project.commands.find((command) => command.name == this.name);
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
      let globalCommand = "";
      if (this.$store.state.env != "") {
        globalCommand += ` --env ${this.$store.state.env}`;
      }
      if (this.$store.state.verbosity != 1) {
        globalCommand += ` -${"v".repeat(this.$store.state.verbosity)}`;
      }
      return this.command.name + argumentsCommand + optionsCommand + globalCommand;
    },
    routes() {
      if (this.name == "route:list") {
        try {
          return { isJSON: true, list: JSON.parse(this.output.trim()) };
        } catch (e) {
          return { isJSON: false };
        }
      }
      return { isJSON: false };
    }
  },
  methods: {
    getArguments() {
      this.argumentsInit = Object.keys(this.command.definition.arguments)
        .map((argument) => this.command.definition.arguments[argument])
        .map((option) => Object.assign({}, option, { value: "" }));
    },
    getOptions() {
      const remove = ["--help", "--quiet", "--verbose", "--version", "--ansi", "--no-ansi", "--no-interaction", "--env"];
      this.optionsInit = Object.keys(this.command.definition.options)
        .map((option) => this.command.definition.options[option])
        .filter((option) => !remove.includes(option.name))
        .map((option) => Object.assign({}, option, { value: option.accept_value ? "" : option.default }));
    },
    getOutputAsync() {
      if (this.$store.state.php !== "") {
        this.output = "Running...";
        this.$store.state.running = true;
        exec(`"${this.$store.state.php}" artisan ${this.fullCommand} --no-interaction --ansi`, { cwd: this.$store.state.dir }, (error, stdout) => {
          if (error) {
            if (stdout.includes("Could not open input file: artisan")) {
              let message = `${this.$store.state.dir} - This folder is not a Laravel project. Please create a Laravel project and then open it.`;
              window.Electron.dialogError(message);
            }
          }
          this.output = Anser.ansiToHtml(Anser.escapeForHtml(stdout.trim()), { use_classes: true });
          this.$refs["terminal-end"].scrollIntoView();
          this.$store.state.running = false;
        });
        this.$refs["terminal-end"].scrollIntoView();
      } else {
        window.Electron.dialogPhpNotFound();
      }
    }
  },
  mounted() {
    this.getArguments();
    this.getOptions();
  }
};
</script>

<style>
.ansi-yellow-fg {
  @apply text-terminal-yellow dark:text-terminal-d-yellow;
}
.ansi-green-fg {
  @apply text-terminal-green dark:text-terminal-d-green;
}
.ansi-red-bg {
  @apply bg-terminal-red dark:text-terminal-d-red;
}
.ansi-white-fg {
  @apply text-gray-900 dark:text-white;
}
</style>
