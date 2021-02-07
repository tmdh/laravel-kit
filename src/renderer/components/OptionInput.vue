<template>
  <div class="flex flex-col lg:flex-row py-2">
    <div class="w-64">
      <label class="text-sm text-gray-900" :for="field.name">{{ cleanName }}</label>
    </div>
    <div class="flex flex-col" v-if="field.accept_value == true">
      <input
        type="text"
        class="h-7 w-72 border-input border-gray-300 border px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500"
        :class="rounded"
        spellcheck="false"
        :id="field.name"
        :value="field.value"
        @input="$emit('input', $event.target.value)"
      />
      <label class="text-xs text-gray-600 mt-1" :for="field.name">{{ field.description }}</label>
    </div>
    <div class="flex flex-row items-center" v-else>
      <input
        type="checkbox"
        class="w-4 h-4 text-blue-100 focus:ring-0 hover:text-blue hover:border-gray-900"
        :class="rounded"
        :id="field.name"
        :checked="field.value"
        @change="$emit('input', $event.target.checked)"
      />
      <label class="ml-2 text-sm text-gray-600" :for="field.name">{{ field.description }}</label>
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
