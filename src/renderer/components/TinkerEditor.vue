<script>
/*
    thanks egoist
    https://github.com/egoist/vue-monaco/blob/master/src/MonacoEditor.js
*/
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
export default {
  name: "TinkerEditor",
  props: {
    value: {
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

  model: {
    event: "change"
  },

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

    value(newValue) {
      if (this.editor) {
        const editor = this.getEditor();
        if (newValue !== editor.getValue()) {
          editor.setValue(newValue);
        }
      }
    },

    language(newVal) {
      if (this.editor) {
        const editor = this.getEditor();
        this.monaco.editor.setModelLanguage(editor.getModel(), newVal);
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

  beforeDestroy() {
    this.editor && this.editor.dispose();
  },

  methods: {
    initMonaco(monaco) {
      this.$emit("editorWillMount", this.monaco);

      const options = Object.assign(
        {},
        {
          value: this.value,
          theme: this.theme,
          language: this.language,
          fontSize: "18px",
          minimap: { enabled: false },
          lineHeight: 32
        },
        this.options
      );
      this.editor = monaco.editor.create(this.$el, options);

      // @event `change`
      const editor = this.getEditor();
      editor.onDidChangeModelContent(event => {
        const value = editor.getValue();
        if (this.value !== value) {
          this.$emit("change", value, event);
        }
      });
      window.addEventListener("resize", () => {
        this.resize();
      });
      this.$emit("editorDidMount", this.editor);
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

  render(h) {
    return h("div");
  }
};
</script>

<style></style>
