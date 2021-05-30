<template>
  <div>
    <label class="ml-2 text-sm text-gray-600 dark:text-white" ><slot></slot></label>
    <input type="checkbox" class="input-checkbox" :checked="checked" />
  </div>
</template>

<script>
export default {
  name: "CheckboxInput",
  props: ['checked'],
};
</script>

<style></style>
