<template>
  <div class="flex flex-col lg:flex-row py-2">
    <div class="w-64">
      <label class="text-sm text-gray-900 dark:text-white" :for="field.name">{{ cleanName }}</label>
    </div>
    <div class="flex flex-col" v-if="field.accept_value == true">
      <input type="text" class="input-text" :class="rounded" spellcheck="false" :id="field.name" :value="field.value" @input="$emit('input', $event.target.value)" />
      <label class="text-xs text-gray-600 mt-1 dark:text-white" :for="field.name">{{ field.description }}</label>
    </div>
    <div class="flex flex-row items-center" v-else>
      <input type="checkbox" class="input-checkbox" :class="rounded" :id="field.name" :checked="field.value" @change="$emit('input', $event.target.checked)" />
      <label class="ml-2 text-sm text-gray-600 dark:text-white" :for="field.name">{{ field.description }}</label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "OptionInput",
  props: ["field"],
  computed: {
    ...mapGetters(["rounded"]),
    cleanName() {
      return this.field.name.substring(2);
    }
  }
};
</script>

<style></style>
