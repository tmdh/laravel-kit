<script>
/*

  The MIT License (MIT)

  Copyright (c) egoist <0x142857@gmail.com> (https://egoist.moe)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  
*/
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { h } from "vue";
export default {
  name: "TinkerEditor",
  props: {
    modelValue: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: "vs"
    },
    language: String,
    options: Object
  },

  emits: ["update:modelValue"],

  watch: {
    options: {
      deep: true,
      handler(options) {
        if (this.editor) {
          const editor = this.getEditor();
          editor.updateOptions(options);
        }
      }
    },

    modelValue(newValue) {
      if (this.editor) {
        const editor = this.getEditor();
        if (newValue !== editor.getValue()) {
          editor.setValue(newValue);
        }
      }
    },

    theme(newVal) {
      if (this.editor) {
        this.monaco.editor.setTheme(newVal);
      }
    }
  },

  mounted() {
    this.monaco = monaco;
    this.$nextTick(() => {
      this.initMonaco(monaco);
    });
  },

  beforeUnmount() {
    this.editor && this.editor.dispose();
  },

  methods: {
    initMonaco(monaco) {
      const options = Object.assign(
        {},
        {
          value: this.modelValue,
          theme: this.$store.state.dark ? "dracula" : "atom-one-light",
          language: this.language,
          fontSize: "18px",
          minimap: { enabled: false },
          lineHeight: 32,
          fontFamily: "RobotoMono"
        },
        this.options
      );
      this.editor = monaco.editor.create(this.$el, options);

      // @event `change`
      const editor = this.getEditor();
      editor.onDidChangeModelContent((event) => {
        const value = editor.getValue();
        if (this.modelValue !== value) {
          this.$emit("update:modelValue", value, event);
        }
      });
      window.addEventListener("resize", () => {
        this.resize();
      });
    },

    getEditor() {
      return this.editor;
    },

    focus() {
      this.editor.focus();
    },

    resize() {
      this.editor.layout({ width: this.$el.offsetWidth, height: this.$el.offsetHeight });
    }
  },

  render() {
    return h("div");
  },

  compatConfig: {
    RENDER_FUNCTION: false
  }
};
</script>

<style></style>
