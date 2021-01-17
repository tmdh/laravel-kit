<template>
  <div v-if="project == null" class="bg-white-100 flex flex-col flex-1 p-5 text-gray-600">
    <h1 class="text-4xl">Kit for Laravel</h1>
    <h2 class="mt-3 text-2xl">Artisan evolved</h2>
    <h3 class="mt-3 text-lg">Start</h3>
    <span class="mt-1 text-sm cursor-pointer text-blue">New project</span>
    <span class="mt-1 text-sm cursor-pointer text-blue" v-on:click="openFolder">Open project...</span>
    <h3 class="mt-6 text-lg">Recent</h3>
    <div class="mt-1 text-sm">
      <span class="cursor-pointer text-blue" @click="openRecent('C:\\Users\\Tareque\\code\\laravel-kit\\laravel-app\\')">laravel-app</span>
      <span class="ml-3">C:\Users\Tareque\code\laravel-kit\laravel-app</span>
    </div>
  </div>
  <div v-else>
    <h1>{{ project.name }}</h1>
  </div>
</template>

<script>
const { remote } = require("electron");
const { dialog } = remote;
import { Project } from "@/api/Project";
import { mapState } from "vuex";
export default {
  name: "Home",
  methods: {
    openFolder() {
      dialog
        .showOpenDialog({
          title: "Open project...",
          buttonLabel: "Open",
          properties: ["openDirectory"],
          multiSelections: false
        })
        .then(result => {
          this.$store.state.project = new Project(result.filePaths[0]);
        });
    },
    openRecent(path) {
      this.$store.state.project = new Project(path);
    }
  },
  computed: mapState(["project"])
};
</script>

<style></style>
