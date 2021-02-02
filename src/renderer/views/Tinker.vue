<template>
  <div class="flex-1 flex flex-row">
    <div class="flex-1" ref="editor"></div>
    <div class="flex-1"></div>
  </div>
</template>

<script>
import { editor } from "monaco-editor";
import dedent from "dedent";
import "./editor";

export default {
  name: "Tinker",
  data() {
    return {
      code: dedent`
        use Illuminate\Foundation\Inspiring;
        Inspiring::quote();
      `
    };
  },
  mounted() {
    editor.create(this.$refs.editor, {
      value: this.code,
      fontSize: "18px",
      language: "php-x",
      theme: "atom-one-light",
      minimap: { enabled: false },
      lineHeight: 32
    });
  }
};
</script>

<style></style>
