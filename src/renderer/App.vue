<template>
  <div class="min-h-screen max-h-screen flex overflow-hidden antialiased select-none flex-col" :class="[dark && licensed ? 'dark bg-d-blue-500 text-white' : 'bg-white-100']">
    <div class="flex-1 overflow-hidden flex">
      <nav class="flex flex-col w-15 justify-between">
        <div>
          <button @click="tab = 'Home'" class="link" :class="{ 'link-active': tab == 'Home' }" title="Home">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button @click="tab = 'Artisan'" class="link" v-if="project != null" :class="{ 'link-active': tab == 'Artisan' }" title="Artisan">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
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
      <component :is="tab" class="border-l-1 dark:border-d-blue-800"></component>
    </div>
    <div class="h-6 text-xs flex flex-row bg-gray-100 text-gray-800 dark:bg-d-blue-800 dark:text-white">
      <div class="bg-blue hover:bg-blue-100 px-3 cursor-pointer h-6 flex items-center">
        <svg class="h-4 text-white" viewBox="0 0 50 52">
          <path
            d="M49.626 11.564a.809.809 0 0 1 .028.209v10.972a.8.8 0 0 1-.402.694l-9.209 5.302V39.25c0 .286-.152.55-.4.694L20.42 51.01c-.044.025-.092.041-.14.058-.018.006-.035.017-.054.022a.805.805 0 0 1-.41 0c-.022-.006-.042-.018-.063-.026-.044-.016-.09-.03-.132-.054L.402 39.944A.801.801 0 0 1 0 39.25V6.334c0-.072.01-.142.028-.21.006-.023.02-.044.028-.067.015-.042.029-.085.051-.124.015-.026.037-.047.055-.071.023-.032.044-.065.071-.093.023-.023.053-.04.079-.06.029-.024.055-.05.088-.069h.001l9.61-5.533a.802.802 0 0 1 .8 0l9.61 5.533h.002c.032.02.059.045.088.068.026.02.055.038.078.06.028.029.048.062.072.094.017.024.04.045.054.071.023.04.036.082.052.124.008.023.022.044.028.068a.809.809 0 0 1 .028.209v20.559l8.008-4.611v-10.51c0-.07.01-.141.028-.208.007-.024.02-.045.028-.068.016-.042.03-.085.052-.124.015-.026.037-.047.054-.071.024-.032.044-.065.072-.093.023-.023.052-.04.078-.06.03-.024.056-.05.088-.069h.001l9.611-5.533a.801.801 0 0 1 .8 0l9.61 5.533c.034.02.06.045.09.068.025.02.054.038.077.06.028.029.048.062.072.094.018.024.04.045.054.071.023.039.036.082.052.124.009.023.022.044.028.068zm-1.574 10.718v-9.124l-3.363 1.936-4.646 2.675v9.124l8.01-4.611zm-9.61 16.505v-9.13l-4.57 2.61-13.05 7.448v9.216l17.62-10.144zM1.602 7.719v31.068L19.22 48.93v-9.214l-9.204-5.209-.003-.002-.004-.002c-.031-.018-.057-.044-.086-.066-.025-.02-.054-.036-.076-.058l-.002-.003c-.026-.025-.044-.056-.066-.084-.02-.027-.044-.05-.06-.078l-.001-.003c-.018-.03-.029-.066-.042-.1-.013-.03-.03-.058-.038-.09v-.001c-.01-.038-.012-.078-.016-.117-.004-.03-.012-.06-.012-.09v-.002-21.481L4.965 9.654 1.602 7.72zm8.81-5.994L2.405 6.334l8.005 4.609 8.006-4.61-8.006-4.608zm4.164 28.764l4.645-2.674V7.719l-3.363 1.936-4.646 2.675v20.096l3.364-1.937zM39.243 7.164l-8.006 4.609 8.006 4.609 8.005-4.61-8.005-4.608zm-.801 10.605l-4.646-2.675-3.363-1.936v9.124l4.645 2.674 3.364 1.937v-9.124zM20.02 38.33l11.743-6.704 5.87-3.35-8-4.606-9.211 5.303-8.395 4.833 7.993 4.524z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </div>
      <div class="status-item">{{ tab }}</div>
      <div class="status-item" v-if="opening">
        <loading-icon></loading-icon>
        Opening project...
      </div>
      <div class="status-item" v-if="running">
        <loading-icon></loading-icon>
        Running...
      </div>
      <div class="status-item" v-if="tinkering">
        <loading-icon></loading-icon>
        Tinkering...
      </div>
    </div>
  </div>
</template>

<script>
import Home from "@/views/Home";
import Artisan from "@/views/Artisan";
import Tinker from "@/views/Tinker";
import Settings from "@/views/Settings";
import { mapState } from "vuex";
import LoadingIcon from "@/components/LoadingIcon";

export default {
  name: "App",
  components: { Home, Artisan, Tinker, Settings, LoadingIcon },
  data() {
    return {
      tab: "Home"
    };
  },
  computed: mapState(["project", "opening", "running", "tinkering", "dark", "licensed"]),
  mounted() {
    this.$root.$on("changeTab", tab => {
      this.tab = tab;
    });
  }
};
</script>

<style>
/*
  link, link-active in styles
*/
</style>
