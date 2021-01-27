<template>
  <div class="flex flex-row flex-1">
    <div class="bg-gray-100 w-72 flex flex-col">
      <h1 class="uppercase font-bold text-gray-500 px-5 pt-5 pb-4">Artisan</h1>
      <div class="px-3 pb-3">
        <input type="text" v-model="searchKeyword" class="w-full h-7 border-input border-gray-300 border rounded placeholder-gray-800 px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500" placeholder="Search" />
      </div>
      <div class="overflow-scroll overflow-x-hidden flex-1 flex flex-col pb-4">
        <command-list :searchResults="searchResults"></command-list>
      </div>
    </div>
    <div class="bg-gray-100 flex flex-col flex-1">
      <div class="flex justify-between items-center">
        <h1 class="font-bold px-5 py-4 text-gray-500">{{ name }}</h1>
        <div class="mr-2">
          <a class="underline hover:text-blue mr-2 cursor-pointer">http://127.0.0.1:8000</a>
          <button class="bg-green hover:bg-green-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2 focus:ring-green">Serve</button>
          <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2">Open folder</button>
          <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2">Open In Editor</button>
        </div>
      </div>
      <keep-alive>
        <router-view :key="$route.fullPath" max="5" class="bg-white-100 flex-1 overflow-y-auto pl-7 pr-2 py-5 text-xl"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import CommandList from "@/components/CommandList.vue";
import { mapState } from "vuex";

export default {
  name: "Artisan",
  components: { CommandList },
  data() {
    return {
      searchKeyword: ""
    };
  },
  computed: {
    ...mapState(["name"]),
    searchResults() {
      const remove = ["serve", "tinker"];
      return this.$store.state.project.commands.filter(command => command.name.includes(this.searchKeyword) && !remove.includes(command.name)).sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  }
};
</script>

<style></style>
