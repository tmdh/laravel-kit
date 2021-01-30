<template>
  <div class="h-screen flex bg-white-100 antialiased overflow-x-hidden select-none">
    <side-nav></side-nav>
    <keep-alive>
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
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
