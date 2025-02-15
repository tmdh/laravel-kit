<template>
  <div class="h-full grid grid-cols-1 md:grid-cols-2">
    <div class="flex flex-col h-full">
      <tinker-editor
        class="flex-1"
        v-model="code"
        language="php-x"
        theme="one-light">
      </tinker-editor>
      <div class="flex justify-center px-3 py-2 md:justify-start">
        <div class="flex flex-row items-center">
          <input
            type="checkbox"
            class="form-checkbox input-checkbox"
            id="autoTinker"
            :checked="autoTinker"
            @change="enableautoTinker($event.target.checked)" />
          <label class="ml-2 text-sm text-gray-600 dark:text-white" for="autoTinker">
            Auto Tinker
          </label>
        </div>
        <kit-button @clicked="executeTinker" class="ml-auto">
          Tinker
        </kit-button>
      </div>
    </div>
    <div class="h-full">
      <tinker-editor
        class="h-full"
        v-model="output"
        language="php-x"
        theme="one-light"
        :options="outputOptions">
      </tinker-editor>
    </div>
  </div>
</template>

<script>
import TinkerEditor from "@/components/TinkerEditor.vue";
import KitButton from "@/components/KitButton.vue";
import { mapState, mapActions } from "vuex";
import initTinker from "@/lib/tinker.ts";
initTinker();

export default {
  name: "Tinker",
  components: { TinkerEditor, KitButton },
  data() {
    return {
      outputOptions: {
        readOnly: true,
        wordWrap: "wordWrapColumn",
        wordWrapColumn: 100
      },
      timeOut: 0
    };
  },
  computed: {
    ...mapState(["dir"]),
    theme() {
      return this.$store.state.dark ? "dracula" : "one-light";
    },
    autoTinker: {
      set(value) {
        this.$store.state.autoTinker = value;
      },
      get() {
        return this.$store.state.autoTinker;
      }
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
        return this.getFormattedString(this.$store.state.output);
      }
    }
  },
  watch: {
    code: function () {
      if (!this.$store.state.autoTinker) {
        return;
      }
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.executeTinker();
      }, 800);
    }
  },
  methods: {
    enableautoTinker(value) {
      if (typeof this.$store.state.autoTinker === "undefined") {
        this.$store.state.autoTinker = false;
      } else {
        this.$store.state.autoTinker = value;
      }
    },

    getFormattedString(output) {
      const hasPrefixArrow = this.hasPrefixArrow(output);
      const outputWithoutPrefixArrow = hasPrefixArrow ? this.removePrefixArrow(output) : output;
      const properlyQuotedOutput = this.removeExtraQuotes(outputWithoutPrefixArrow);

      if (this.isJson(properlyQuotedOutput)) {
        output = JSON.stringify(JSON.parse(properlyQuotedOutput), null, "\t");

        if (hasPrefixArrow) {
          output = `=> ${output}`;
        }
      }

      return output;
    },

    hasPrefixArrow(str) {
      return str.substr(0, 3) === "=> ";
    },

    removePrefixArrow(str) {
      return str.substring(3);
    },

    isJson(str) {
      try {
        const parsedObject = JSON.parse(str);
        if (parsedObject && typeof parsedObject === `object`) {
          return true;
        }
      } catch (err) {
        return false;
      }
      return false;
    },

    removeExtraQuotes(str) {
      return str.substr(1, str.length - 2);
    },

    ...mapActions(["executeTinker"])
  }
};
</script>

<style></style>
