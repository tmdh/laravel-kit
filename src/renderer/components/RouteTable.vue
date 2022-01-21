<template>
  <table class="text-left text-xs border dark:border-d-blue-800 overflow-x">
    <tr class="bg-gray-100 font-semibold dark:bg-d-blue-700">
      <td class="py-1.5 pl-3 pr-5" v-for="col in cols" :key="col" v-text="col == 'uri' ? 'URI' : col[0].toUpperCase() + col.slice(1)"></td>
    </tr>
    <tr class="border dark:border-d-blue-800" v-for="(route, index) in routes.list" :key="index">
      <td class="py-1.5 pl-3 pr-5" v-for="col in cols" :key="col">
        <span v-if="route[col] !== null && majorVersion < 8">
          <span v-for="item in route[col].split('\n')" :key="item" class="font-mono mr-2 p-1 bg-gray-200 rounded-md dark:bg-d-blue-700 whitespace-pre-wrap break-all">{{ item }}</span>
        </span>
        <span v-if="route[col] !== null && majorVersion >= 8 && col == 'middleware'">
          <span v-for="item in route[col]" :key="item" class="font-mono mr-2 p-1 bg-gray-200 rounded-md dark:bg-d-blue-700 whitespace-pre-wrap break-all">{{ item }}</span>
          <br />
        </span>
        <span v-if="route[col] !== null && majorVersion >= 8 && col != 'middleware'">
          <span :key="route[col]" class="font-mono mr-2 p-1 bg-gray-200 rounded-md dark:bg-d-blue-700 whitespace-pre-wrap break-all">{{ route[col] }}</span>
        </span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "RouteTable",
  props: ["routes"],
  computed: {
    cols() {
      return Object.keys(this.routes.list[0]);
    },
    majorVersion() {
      return parseInt(this.$store.state.project.application.version.split(".")[0]);
    }
  }
};
</script>

<style></style>
