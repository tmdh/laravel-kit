<template>
  <div v-if="project == null" class="bg-white-100 flex-1 p-5 text-gray-600">
    <h1 class="text-4xl">Kit for Laravel</h1>
    <h2 class="mt-3 text-2xl">Artisan evolved</h2>
    <h3 class="mt-3 text-lg">Start</h3>
    <ul class="text-sm">
      <li class="mt-1">
        <span class="cursor-pointer text-blue">New project</span>
      </li>
      <li class="mt-1">
        <span class="cursor-pointer text-blue" @click="openDialog">Open project...</span>
      </li>
    </ul>
    <h3 class="mt-6 text-lg">Recent</h3>
    <ul class="text-sm" v-if="recents.length">
      <li class="mt-1" v-for="recent in recents" :key="recent">
        <span class="cursor-pointer text-blue" @click="openProject({ dir: recent })" v-text="basename(recent)"></span>
        <span class="ml-3">{{ recent }}</span>
      </li>
    </ul>
    <span v-else class="text-sm mt-1">No recently opened projects</span>
    <h3 class="mt-6 text-lg">Help</h3>
    <ul class="text-sm">
      <li class="mt-1" v-for="link in helpLinks" :key="link.id">
        <span class="cursor-pointer text-blue" @click="openLink(link)" :title="link.href">{{ link.name }}</span>
      </li>
    </ul>
  </div>
  <div v-else>
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
import { shell } from "electron";
import { mapState, mapActions } from "vuex";
import { basename } from "path";
export default {
  name: "Home",
  data() {
    return {
      helpLinks: [
        {
          id: 1,
          name: "Video Tutorials",
          href: "https://youtube.com"
        },
        {
          id: 2,
          name: "Documentation",
          href: "https://github.com/tmdh/laravel-kit/wiki"
        },
        {
          id: 3,
          name: "GitHub Repository",
          href: "https://github.com/tmdh/laravel-kit/"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["openDialog", "openProject"]),
    openLink(link) {
      shell.openExternal(link.href);
    },
    basename(dir) {
      return basename(dir.toString());
    }
  },
  computed: {
    ...mapState(["project", "name", "dir", "recents"])
  }
};
</script>

<style></style>
