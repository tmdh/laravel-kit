<template>
  <div class="flex-1 p-8">
    <h1 class="text-xl mb-2">Settings</h1>
    <div class="h-px bg-gray-300"></div>
    <div class="flex flex-col lg:flex-row py-1">
      <div class="w-96 my-2">
        <label class="text-sm text-gray-900 dark:text-white" for="php">PHP executable path</label>
      </div>
      <input type="text" class="input-text my-2" spellcheck="false" id="php" v-model="php" />
    </div>
    <kit-button class="mb-2 h-7 inline-block" @click.native="selectExecutable">Select</kit-button>
    <div class="text-xs">Detected PHP version: {{ this.phpv }}</div>
    <div class="flex flex-col lg:flex-row py-1">
      <div class="w-96 my-2">
        <label class="text-sm text-gray-900 dark:text-white" for="env">The environment artisan commands should run under</label>
      </div>
      <input type="text" class="input-text my-2" spellcheck="false" id="env" v-model="env" />
    </div>
    <div class="flex flex-col lg:flex-row py-1">
      <div class="w-96 my-2">
        <label class="text-sm text-gray-900 dark:text-white" for="editor">Open In Editor command</label>
      </div>
      <input type="text" class="input-text my-2" spellcheck="false" id="editor" v-model="editor" />
    </div>
    <div class="flex flex-col lg:flex-row py-1">
      <div class="w-96 my-2">
        <label class="text-sm text-gray-900 dark:text-white" for="verbosity">Artisan output verbosity</label>
      </div>
      <select type="text" class="input-text px-1 py-0 my-2" spellcheck="false" id="verbosity" v-model="verbosity">
        <option :value="1">Normal</option>
        <option :value="2">Verbose</option>
        <option :value="3">Debug</option>
      </select>
    </div>
    <div class="flex flex-col lg:flex-row py-1">
      <div class="w-96 my-2">
        <label class="text-sm text-gray-900 dark:text-white" for="dark">Color theme</label>
      </div>
      <select type="text" class="input-text px-1 py-0 my-2" id="dark" v-model="dark">
        <option :value="false">Light</option>
        <option :value="true">Dark</option>
      </select>
    </div>
    <div class="flex flex-row items-center">
      <kit-button class="mt-2" @click.native="saveSettings">Save settings</kit-button>
      <transition name="fade">
        <span class="flex flex-row items-center ml-4 text-blue dark:text-blue-100" v-if="saved">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Settings saved.
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
import KitButton from "@/components/KitButton.vue";
import Store from "electron-store";
import { remote } from "electron";
const { dialog } = remote;
const estore = new Store();
import { exec } from "child_process";

export default {
  name: "Settings",
  components: { KitButton },
  data() {
    return {
      php: "",
      verbosity: 1,
      env: "",
      editor: "",
      saved: false,
      dark: false,
      phpv: ""
    };
  },
  methods: {
    selectExecutable() {
      dialog
        .showOpenDialog({
          title: "Select php executable",
          properties: ["openFile"]
        })
        .then((result) => {
          if (!result.canceled) {
            this.php = result.filePaths[0];
          }
        });
    },
    getPHPv() {
      exec(`"${this.php}" -v`, (error, stdout) => {
        if (error) {
          window.Electron.dialogError("PHP detection failed.");
          this.updatePHPv("unavailable");
        } else {
          this.updatePHPv(stdout.split("\n")[0]);
        }
      });
    },
    updatePHPv(text) {
      this.phpv = text;
    },
    saveSettings() {
      this.saved = false;
      estore.set("php", this.php);
      estore.set("verbosity", this.verbosity);
      estore.set("env", this.env);
      estore.set("editor", this.editor);
      estore.set("dark", this.dark);
      this.$store.commit("updateSettingsState");
      setTimeout(() => {
        this.saved = true;
      }, 500);
      this.getPHPv();
    }
  },
  mounted() {
    this.php = estore.get("php");
    this.verbosity = estore.get("verbosity");
    this.env = estore.get("env");
    this.editor = estore.get("editor");
    this.dark = estore.get("dark");
    this.getPHPv();
    this.$store.commit("updateSettingsState");
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
