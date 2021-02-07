<template>
  <div class="flex-1 flex flex-col md:flex-row pt-2">
    <div class="flex flex-col flex-1">
      <tinker-editor class="flex-1" v-model="code" language="php-x" theme="atom-one-light"></tinker-editor>
      <div class="py-2 px-3 flex justify-center md:justify-start">
        <kit-button @click.native="executeTinker">Tinker</kit-button>
      </div>
    </div>
    <tinker-editor class="flex-1" v-model="output" language="php-x" theme="atom-one-light" :options="outputOptions"></tinker-editor>
  </div>
</template>

<script>
import TinkerEditor from "@/components/TinkerEditor";
import KitButton from "@/components/KitButton";
import { mapGetters, mapState } from "vuex";
import { spawn } from "child_process";
import "@/lib/tinker";

export default {
  name: "Tinker",
  components: { TinkerEditor, KitButton },
  data() {
    return {
      code: `use Illuminate\\Foundation\\Inspiring;\nInspiring::quote();`,
      output: "",
      outputOptions: {
        readOnly: true,
        wordWrap: "wordWrapColumn",
        wordWrapColumn: 50,
        wordWrapMinified: true,
        wrappingIndent: "indent"
      }
    };
  },
  computed: { ...mapState(["dir"]), ...mapGetters(["rounded"]) },
  methods: {
    executeTinker() {
      const tinker = spawn("php", ["artisan", "tinker"], { cwd: this.dir });
      tinker.stdout.setEncoding("utf-8");
      tinker.stdout.on("data", data => {
        this.output = data;
      });
      tinker.stdin.write(this.code);
      tinker.stdin.end();
    }
  }
};
</script>

<style></style>
