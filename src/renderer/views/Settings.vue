<template>
  <div class="flex-1 p-8">
    <h1 class="text-xl mb-2">Settings</h1>
    <div class="h-px bg-gray-300"></div>
    <div class="flex flex-col lg:flex-row py-5">
      <div class="w-96">
        <label class="text-sm text-gray-900" for="env">The environment artisan commands should run under</label>
      </div>
      <input
        type="text"
        class="h-7 w-72 border-input border-gray-300 border px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500"
        :class="rounded"
        spellcheck="false"
        id="env"
        v-model="env"
      />
    </div>
    <div class="flex flex-col lg:flex-row py-5">
      <div class="w-96">
        <label class="text-sm text-gray-900" for="editor">Open In Editor command</label>
      </div>
      <input
        type="text"
        class="h-7 w-72 border-input border-gray-300 border px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500"
        :class="rounded"
        spellcheck="false"
        id="editor"
        v-model="editor"
      />
    </div>
    <div class="flex flex-col lg:flex-row py-5">
      <div class="w-96">
        <label class="text-sm text-gray-900" for="verbosity">Artisan output verbosity</label>
      </div>
      <select
        type="text"
        class="h-7 w-72 border-input border-gray-300 border px-1 py-0 text-xs  hover:border-gray-400 focus:outline-none focus:border-gray-500"
        :class="rounded"
        spellcheck="false"
        id="verbosity"
        v-model="verbosity"
      >
        <option :value="1">Normal</option>
        <option :value="2">Verbose</option>
        <option :value="3">Debug</option>
      </select>
    </div>
    <div class="flex flex-row items-center">
      <kit-button class="mt-2" @click.native="saveSettings">Save settings</kit-button>
      <transition name="fade">
        <span class="flex flex-row items-center ml-4 text-blue" v-if="saved">
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
import KitButton from "@/components/KitButton";
import Store from "electron-store";
import { mapGetters } from "vuex";
const estore = new Store();
export default {
  name: "Settings",
  components: { KitButton },
  data() {
    return {
      verbosity: 1,
      env: "",
      editor: "",
      saved: false
    };
  },
  computed: mapGetters(["rounded"]),
  methods: {
    saveSettings() {
      this.saved = false;
      estore.set("verbosity", this.verbosity);
      estore.set("env", this.env);
      estore.set("editor", this.editor);
      this.$store.commit("updateSettingsState");
      setTimeout(() => {
        this.saved = true;
      }, 500);
    }
  },
  mounted() {
    this.verbosity = estore.get("verbosity");
    this.env = estore.get("env");
    this.editor = estore.get("editor");
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
