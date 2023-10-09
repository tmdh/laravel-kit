<template>
  <div class="flex-1">
    <div class="flex justify-between">
      <h1 class="font-mono text-xl">{{ command.name }}</h1>
      <kit-button @clicked="getOutputAsync">Run</kit-button>
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
        <input type="checkbox" class="form-checkbox input-checkbox" id="routeTable" :checked="routeTable" v-model="routeTable" />
        <label class="ml-2 text-sm text-gray-600 dark:text-white" for="routeTable">Show JSON as table</label>
      </div>
      <div ref="terminal" class="font-mono text-sm mt-3 flex flex-col">
        <div class="select-text">
          <span>→</span> <span class="text-terminal-cyan dark:text-terminal-d-cyan">{{ appName }}</span> <span class="text-terminal-purple dark:text-terminal-d-purple">›</span>
          <span class="text-terminal-green dark:text-terminal-d-green">&nbsp;php</span>
          <span> artisan {{ fullCommand }}</span>
        </div>
        <pre class="pb-4 select-text whitespace-pre-wrap break-all" v-html="output"></pre>
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
      if (this.$store.state.project) {
        return this.$store.state.project.commands.find((command) => command.name == this.name);
      } else {
        return {};
      }
    },
    fullCommand() {
      return this.artisanArray.reduce((prev, cur) => {
        return `${prev} ${cur}`;
      });
    },
    artisanArray() {
      let artisanArray = [];
      artisanArray.push(this.name);
      if (this.argumentsInit.length > 0) {
        this.argumentsInit.forEach((argument) => {
          if (argument.value != "") {
            artisanArray.push(argument.value);
          }
        });
      }
      if (this.optionsInit.length > 0) {
        this.optionsInit.forEach((option) => {
          if (!(option.value == "" || option.value == false)) {
            artisanArray.push(`${option.name}${option.accept_value ? "=" + option.value : ""}`);
          }
        }, "");
      }
      return artisanArray;
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
    async getOutputAsync() {
      if (this.$store.state.php !== "") {
        this.output = "Running...";
        this.$store.state.running = true;
        const stdout = await window.kit.artisan(this.artisanArray, this.$store.state.dir);
        this.output = Anser.ansiToHtml(Anser.escapeForHtml(stdout.trim()), { use_classes: true });
        this.$refs["terminal-end"].scrollIntoView();
        this.$store.state.running = false;
      } else {
        window.kit.dialogPhpNotFound();
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
