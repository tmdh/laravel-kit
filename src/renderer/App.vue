<template>
  <div class="h-screen flex bg-white-100 antialiased overflow-x-hidden select-none">
    <side-nav></side-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import SideNav from "@/components/SideNav.vue";
export default {
  name: "App",
  components: { SideNav }
};
</script>

<style></style>
