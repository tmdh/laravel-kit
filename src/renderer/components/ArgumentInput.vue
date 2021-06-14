<template>
  <div class="flex flex-col md:flex-row py-2">
    <div class="w-64">
      <label class="text-sm text-gray-900 dark:text-white" :for="field.name">{{ field.name }}</label>
    </div>
    <div class="flex flex-col mt-2">
      <input type="text" class="input-text" spellcheck="false" :id="field.name" :value="field.value" @input="$emit('input', $event.target.value)" />
      <label class="text-xs text-gray-600 mt-1 dark:text-white" :for="field.name">{{ field.description }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArgumentInput",
  props: ["field"]
};
</script>

<style></style>
