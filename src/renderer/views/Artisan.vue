<template>
  <div class="flex flex-row flex-1">
    <div class="bg-gray-100 w-44 md:w-72 flex flex-col dark:bg-d-blue-700">
      <h1 class="uppercase font-semibold text-gray-500 px-5 pt-5 pb-4 tracking-wide dark:text-white">Artisan</h1>
      <div class="px-3 pb-3">
        <input
          type="text"
          v-model="searchKeyword"
          class="w-full h-7 border-input border-gray-300 border placeholder-gray-800 px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500 dark:bg-d-blue-600 dark:border-d-gray-300 dark:placeholder-d-blue-100 rounded-md"
          placeholder="Search"
        />
      </div>
      <div class="overflow-scroll overflow-x-hidden flex-1 flex flex-col pb-4">
        <div class="flex flex-col text-xs font-mono font-light">
          <span
            v-for="command in searchResults"
            :key="command.name"
            @click="commandName = command.name"
            :class="{ 'bg-gray-300 dark:bg-d-blue-200': commandName == command.name }"
            class="px-6 py-1.5 hover:bg-gray-200 dark:hover:bg-d-blue-400"
            :alt="command.description"
            >{{ command.name }}</span
          >
        </div>
      </div>
    </div>
    <div class="bg-gray-100 flex flex-col flex-1 dark:bg-d-blue-700">
      <div class="flex justify-between items-center px-3 py-3 pr-2">
        <div class="hidden flex-row items-center sm:flex">
          <span class="font-semibold text-gray-500 dark:text-white">{{ name }}</span>
          <span class="ml-2 text-xs bg-blue hover:bg-blue-100 text-white px-1 py-0.5 rounded-md">{{ version }}</span>
        </div>
        <div>
          <a class="underline hover:text-blue mr-2 cursor-pointer" v-if="serve != null && serveLink != null" @click="openServe" v-text="serveLink" title="Open link in the browser"></a>
          <kit-button @click.native="serveService" :title="serve == null ? 'Serve the application on the PHP development server' : 'Stop serving'" class="inline-flex items-center">
            <component :is="serve == null ? 'ServeIcon' : 'StopIcon'" class="mr-0 md:mr-2 mt-0.5"></component>
            <span class="hidden md:block" v-text="serve == null ? 'Serve' : 'Stop'"></span>
          </kit-button>
          <kit-button @click.native="openFolder" title="Open folder in Explorer/Finder" class="inline-flex items-center">
            <folder-icon class="mr-0 md:mr-2 mt-0.5"></folder-icon> <span class="hidden md:block">Open folder</span>
          </kit-button>
          <kit-button @click.native="openInEditor" title="Execute 'Open in editor' command specified in Settings" class="inline-flex items-center">
            <editor-icon class="mr-0 md:mr-2 mt-0.5"></editor-icon> <span class="hidden md:block">Open in editor</span>
          </kit-button>
        </div>
      </div>
      <command v-if="commandName != null" :name="commandName" :key="commandName" class="view"></command>
      <artisan-default v-else class="view"></artisan-default>
    </div>
  </div>
</template>

<script>
import KitButton from "@/components/KitButton.vue";
import Command from "@/components/Command.vue";
import ArtisanDefault from "@/components/ArtisanDefault.vue";
import ServeIcon from "@/components/icons/ServeIcon.vue";
import StopIcon from "@/components/icons/StopIcon.vue";
import FolderIcon from "@/components/icons/FolderIcon.vue";
import EditorIcon from "@/components/icons/EditorIcon.vue";
import { mapState, mapActions } from "vuex";
import { remote } from "electron";
const { showItemInFolder, openExternal } = remote.shell;
import { exec } from "child_process";

export default {
  name: "Artisan",
  components: { KitButton, Command, ArtisanDefault, ServeIcon, StopIcon, FolderIcon, EditorIcon },
  data() {
    return {
      searchKeyword: "",
      commandName: null
    };
  },
  computed: {
    ...mapState(["name", "serve", "serveLink"]),
    version() {
      return this.$store.state.project.application.version;
    },
    searchResults() {
      const remove = ["serve", "tinker", "db", "schedule:work"];
      return this.$store.state.project.commands
        .filter((command) => command.name.includes(this.searchKeyword) && !remove.includes(command.name) && !command.name.includes("queue"))
        .sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  },
  methods: {
    openFolder() {
      showItemInFolder(this.$store.state.dir);
    },
    openServe() {
      openExternal(this.serveLink);
    },
    ...mapActions(["startServe", "stopServe"]),
    serveService() {
      if (this.serve == null) {
        this.startServe();
      } else {
        this.stopServe();
      }
    },
    openInEditor() {
      exec(this.$store.state.editor, { cwd: this.$store.state.dir });
    }
  }
};
</script>

<style>
/*
  .view in styles.css
*/
</style>
