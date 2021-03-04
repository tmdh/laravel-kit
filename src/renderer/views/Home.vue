<template>
  <div v-if="project == null" class="bg-white-100 flex-1 p-5 text-gray-700 tracking-wide overflow-y-auto dark:bg-d-blue-500 dark:text-white">
    <h1 class="text-4xl">Kit for Laravel</h1>
    <h2 class="mt-3 text-2xl">Artisan evolved</h2>
    <h3 class="mt-3 text-lg">Start</h3>
    <ul class="text-sm">
      <li class="mt-1">
        <span class="cursor-pointer text-blue dark:text-blue-100" @click="openDialog">Open project...</span>
      </li>
    </ul>
    <h3 class="mt-6 text-lg">Recent</h3>
    <ul class="text-sm" v-if="recents.length">
      <li class="mt-1" v-for="recent in recents" :key="recent">
        <span class="cursor-pointer text-blue dark:text-blue-100" @click="openProject({ dir: recent })" v-text="basename(recent)"></span>
        <span class="ml-3">{{ recent }}</span>
      </li>
    </ul>
    <span v-else class="text-sm mt-1">No recently opened projects</span>
    <h3 class="mt-6 text-lg">Help</h3>
    <ul class="text-sm">
      <li class="mt-1" v-for="link in helpLinks" :key="link.id">
        <span class="cursor-pointer text-blue dark:text-blue-100" @click="openLink(link)" :title="link.href">{{ link.name }}</span>
      </li>
    </ul>
  </div>
  <div v-else class="bg-white-100 flex-1 p-5 text-gray-600 flex justify-center items-center dark:bg-d-blue-500 dark:text-white">
    <div class="text-center">
      <h1 class="text-3xl font-semibold">Build something amazing!</h1>
      <kit-button class="mt-10" @click.native="changeTab('Artisan')">Go to Artisan</kit-button>
      <p class="italic text-lg mt-8">or</p>
      <kit-button class="mt-10" @click.native="changeTab('Tinker')">Start Tinkering</kit-button>
    </div>
  </div>
</template>

<script>
import { shell } from "electron";
import { mapState, mapActions } from "vuex";
import { basename } from "path";
import KitButton from "@/components/KitButton";
export default {
  name: "Home",
  components: { KitButton },
  data() {
    return {
      helpLinks: [
        {
          id: 1,
          name: "Wiki",
          href: "https://github.com/tmdh/laravel-kit/wiki/"
        },
        {
          id: 2,
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
    },
    changeTab(tab) {
      this.$root.$emit("changeTab", tab);
    }
  },
  computed: {
    ...mapState(["project", "name", "dir", "recents"])
  }
};
</script>

<style scoped>
h1,
h2,
h3 {
  font-weight: 300;
}
</style>
