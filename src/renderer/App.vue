<template>
  <div class="min-h-screen max-h-screen overflow-hidden flex bg-white-100 antialiased overflow-x-hidden select-none">
    <nav class="flex flex-col w-15 justify-between">
      <div>
        <button @click="tab = 'Home'" class="link" :class="{ 'link-active': tab == 'Home' }" title="Home">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
        <button @click="tab = 'Artisan'" class="link" v-if="project != null" :class="{ 'link-active': tab == 'Artisan' }" title="Artisan">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
        <button @click="tab = 'Tinker'" class="link" v-if="project != null" :class="{ 'link-active': tab == 'Tinker' }" title="Tinker">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>
      <button @click="tab = 'Settings'" class="link" :class="{ 'link-active': tab == 'Settings' }" title="Settings">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </nav>
    <component :is="tab"></component>
  </div>
</template>

<script>
import Home from "@/views/Home.vue";
import Artisan from "@/views/Artisan.vue";
import Tinker from "@/views/Tinker.vue";
import Settings from "@/views/Settings.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: { Home, Artisan, Tinker, Settings },
  data() {
    return {
      tab: "Home"
    };
  },
  computed: mapState(["project"])
};
</script>

<style>
.link {
  @apply flex w-14 h-15 text-gray-400 border-white-100 hover:text-gray-900 border-l-3 justify-center items-center focus:outline-none focus:text-gray-900;
}
.link-active {
  @apply text-gray-900 border-gray-900;
}
</style>
