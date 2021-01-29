<template>
  <div class="flex flex-row py-2">
    <div class="w-64">
      <label class="text-sm text-gray-900" :for="field.name">{{ field.name }}</label>
    </div>
    <div class="flex flex-col">
      <input type="text" class="h-7 w-72 border-input border-gray-300 border rounded px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500" spellcheck="false" :id="field.name" :value="field.value" @input="$emit('input', $event.target.value)" />
      <label class="text-xs text-gray-600 mt-1" :for="field.name">{{ field.description }}</label>
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
