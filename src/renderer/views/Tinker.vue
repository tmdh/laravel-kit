<template>
  <div class="flex-1 flex flex-col md:flex-row pt-2">
    <div class="flex flex-col flex-1">
      <tinker-editor class="flex-1" v-model="code" language="php-x" theme="one-light"></tinker-editor>
      <div class="py-2 px-3 flex justify-center md:justify-start">
        <kit-button @click.native="executeTinker">Tinker</kit-button>
      </div>
    </div>
    <tinker-editor class="flex-1" v-model="output" language="php-x" theme="one-light" :options="outputOptions"></tinker-editor>
  </div>
</template>

<script>
import TinkerEditor from "@/components/TinkerEditor";
import KitButton from "@/components/KitButton";
import { mapState } from "vuex";
import { spawn } from "child_process";
import "@/lib/tinker";

export default {
  name: "Tinker",
  components: { TinkerEditor, KitButton },
  data() {
    return {
      outputOptions: {
        readOnly: true,
        wordWrap: "wordWrapColumn",
        wordWrapColumn: 100
      }
    };
  },
  computed: {
    ...mapState(["dir"]),
    theme() {
      return this.$store.state.dark && this.$store.state.licensed ? "dracula" : "one-light";
    },
    code: {
      set(value) {
        this.$store.state.code = value;
      },
      get() {
        return this.$store.state.code;
      }
    },
    output: {
      set(value) {
        this.$store.state.output = value;
      },
      get() {
        return this.$store.state.output;
      }
    }
  },
  methods: {
    executeTinker() {
      this.$store.state.tinkering = true;
      const tinker = spawn("php", ["artisan", "tinker"], { cwd: this.dir });
      tinker.stdout.setEncoding("utf-8");
      this.$store.state.output = "";
      tinker.stdout.on("data", (data) => {
        this.$store.state.output += data;
        this.$store.state.tinkering = false;
      });
      tinker.stdin.write(this.code);
      tinker.stdin.end();
    }
  }
};
</script>

<style></style>
