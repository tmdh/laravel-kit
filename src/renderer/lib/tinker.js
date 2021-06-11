import { editor, languages } from "monaco-editor/esm/vs/editor/editor.api";

export default function () {
  languages.register({ id: "php-x" });
  languages.setMonarchTokensProvider("php-x", {
    defaultToken: "invalid",
    tokenPostfix: "",
    // ignoreCase: true,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        [/[^<]+/, { token: "@rematch", switchTo: "@phpInSimpleState.root" }] // text
      ], // i

      comment: [[/[^<]+/, { token: "@rematch", switchTo: "@phpInSimpleState.comment" }]],

      phpInSimpleState: [{ include: "phpRoot" }],

      phpRoot: [
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              "@phpKeywords": { token: "keyword.php" },
              "@phpCompileTimeConstants": { token: "constant.php" },
              "@default": "identifier.php"
            }
          }
        ],
        [
          /[$a-zA-Z_]\w*/,
          {
            cases: {
              "@phpPreDefinedVariables": { token: "variable.predefined.php" },
              "@default": "variable.php"
            }
          }
        ],

        // brackets
        [/[{}]/, "delimiter.bracket.php"],
        [/[[\]]/, "delimiter.array.php"],
        [/[()]/, "delimiter.parenthesis.php"],

        // whitespace
        [/[ \t\r\n]+/],

        // comments
        [/(#|\/\/)$/, "comment.php"],
        [/(#|\/\/)/, "comment.php", "@phpLineComment"],

        // block comments
        [/\/\*/, "comment.php", "@phpComment"],

        // strings
        [/"/, "string.php", "@phpDoubleQuoteString"],
        [/'/, "string.php", "@phpSingleQuoteString"],

        // delimiters
        [/[+\-*%&|^~!=<>/?;:.,@]/, "delimiter.php"],

        // numbers
        [/\d*\d+[eE]([-+]?\d+)?/, "number.float.php"],
        [/\d*\.\d+([eE][-+]?\d+)?/, "number.float.php"],
        [/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, "number.hex.php"],
        [/0[0-7']*[0-7]/, "number.octal.php"],
        [/0[bB][0-1']*[0-1]/, "number.binary.php"],
        [/\d[\d']*/, "number.php"],
        [/\d/, "number.php"]
      ],

      phpComment: [
        [/\*\//, "comment.php", "@pop"],
        [/[^*]+/, "comment.php"],
        [/./, "comment.php"]
      ],

      phpLineComment: [
        [/\?>/, { token: "@rematch", next: "@pop" }],
        [/.$/, "comment.php", "@pop"],
        [/[^?]+$/, "comment.php", "@pop"],
        [/[^?]+/, "comment.php"],
        [/./, "comment.php"]
      ],

      phpDoubleQuoteString: [
        [/[^\\"]+/, "string.php"],
        [/@escapes/, "string.escape.php"],
        [/"/, "string.php", "@pop"]
      ],

      phpSingleQuoteString: [
        [/[^\\']+/, "string.php"],
        [/@escapes/, "string.escape.php"],
        [/'/, "string.php", "@pop"]
      ]
    },

    phpKeywords: [
      "abstract",
      "and",
      "array",
      "as",
      "break",
      "callable",
      "case",
      "catch",
      "cfunction",
      "class",
      "clone",
      "const",
      "continue",
      "declare",
      "default",
      "do",
      "else",
      "elseif",
      "enddeclare",
      "endfor",
      "endforeach",
      "endif",
      "endswitch",
      "endwhile",
      "extends",
      "false",
      "final",
      "for",
      "foreach",
      "function",
      "global",
      "goto",
      "if",
      "implements",
      "interface",
      "instanceof",
      "insteadof",
      "namespace",
      "new",
      "null",
      "object",
      "old_function",
      "or",
      "private",
      "protected",
      "public",
      "resource",
      "static",
      "switch",
      "throw",
      "trait",
      "try",
      "true",
      "use",
      "var",
      "while",
      "xor",
      "die",
      "echo",
      "empty",
      "exit",
      "eval",
      "include",
      "include_once",
      "isset",
      "list",
      "require",
      "require_once",
      "return",
      "print",
      "unset",
      "yield",
      "__construct"
    ],

    phpCompileTimeConstants: ["__CLASS__", "__DIR__", "__FILE__", "__LINE__", "__NAMESPACE__", "__METHOD__", "__FUNCTION__", "__TRAIT__"],

    phpPreDefinedVariables: [
      "$GLOBALS",
      "$_SERVER",
      "$_GET",
      "$_POST",
      "$_FILES",
      "$_REQUEST",
      "$_SESSION",
      "$_ENV",
      "$_COOKIE",
      "$php_errormsg",
      "$HTTP_RAW_POST_DATA",
      "$http_response_header",
      "$argc",
      "$argv"
    ],

    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
  });
  languages.setLanguageConfiguration("php-x", {
    autoClosingPairs: [
      { open: "(", close: ")" },
      { open: "{", close: "}" },
      { open: "[", close: "]" }
    ]
  });
  editor.defineTheme("one-light", {
    base: "vs",
    colors: {
      "editorIndentGuide.activeBackground": "#626772",
      "editor.background": "#FAFAFA",
      "editor.foreground": "#383A42",
      "editor.lineHighlightBackground": "#383A420C",
      "editor.selectionBackground": "#E5E5E6",
      "editorCursor.foreground": "#526FFF",
      "editor.findMatchHighlightBackground": "#526FFF33",
      "editorIndentGuide.background": "#383A4233",
      "editorLineNumber.foreground": "#9D9D9F",
      "editorLineNumber.activeForeground": "#383A42",
      "editorWhitespace.foreground": "#383A4233",
      "editorRuler.foreground": "#383A4233",
      "editorHoverWidget.background": "#EAEAEB",
      "editorHoverWidget.border": "#DBDBDC",
      "editorSuggestWidget.background": "#EAEAEB",
      "editorSuggestWidget.border": "#DBDBDC",
      "editorSuggestWidget.selectedBackground": "#FFFFFF",
      "editorWidget.background": "#EAEAEB",
      "editorWidget.border": "#E5E5E6",
      "input.background": "#FFFFFF",
      "input.border": "#DBDBDC",
      focusBorder: "#526FFF",
      "list.activeSelectionBackground": "#DBDBDC",
      "list.activeSelectionForeground": "#232324",
      "list.focusBackground": "#DBDBDC",
      "list.hoverBackground": "#DBDBDC66",
      "list.highlightForeground": "#121417",
      "list.inactiveSelectionBackground": "#DBDBDC",
      "list.inactiveSelectionForeground": "#232324",
      "notification.background": "#333333",
      "pickerGroup.border": "#526FFF",
      "scrollbarSlider.background": "#4E566680",
      "scrollbarSlider.activeBackground": "#747D9180",
      "scrollbarSlider.hoverBackground": "#5A637580",
      "extensionButton.prominentBackground": "#3BBA54",
      "extensionButton.prominentHoverBackground": "#4CC263",
      "badge.background": "#526FFF",
      "badge.foreground": "#FFFFFF"
    },
    inherit: false,
    rules: [
      { token: "comment.php", foreground: "A0A1A7", fontStyle: "italic" },
      { token: "constant.php", foreground: "986801" },
      { token: "identifier.php", foreground: "0184BC" },
      { token: "variable.predefined.php", foreground: "E45649" },
      { token: "variable.php", foreground: "E45649" },
      { token: "string.php", foreground: "50A14F" },
      { token: "number.php", foreground: "986801" },
      { token: "keyword.php", foreground: "A626A4" }
    ]
  });

  editor.defineTheme("dracula", {
    base: "vs-dark",
    colors: {
      contrastBorder: "#191A21",
      focusBorder: "#6272A4",
      foreground: "#F8F8F2",
      "selection.background": "#BD93F9",
      errorForeground: "#FF5555",
      "badge.foreground": "#F8F8F2",
      "badge.background": "#44475A",
      "editor.foreground": "#F8F8F2",
      "editor.background": "#282A36",
      "editorLineNumber.foreground": "#6272A4",
      "editor.selectionBackground": "#44475A",
      "editor.selectionHighlightBackground": "#424450",
      "editor.foldBackground": "#21222C",
      "editor.wordHighlightBackground": "#8BE9FD80",
      "editor.wordHighlightStrongBackground": "#50FA7B80",
      "editor.findMatchBackground": "#FFB86CCC",
      "editor.findMatchHighlightBackground": "#FFFFFF66",
      "editor.findRangeHighlightBackground": "#44475A75",
      "editor.hoverHighlightBackground": "#8BE9FD80",
      "editor.lineHighlightBorder": "#44475A",
      "editorLink.activeForeground": "#8BE9FD",
      "editor.rangeHighlightBackground": "#BD93F926",
      "editor.snippetTabstopHighlightBackground": "#282A36",
      "editor.snippetTabstopHighlightBorder": "#6272A4",
      "editor.snippetFinalTabstopHighlightBackground": "#282A36",
      "editor.snippetFinalTabstopHighlightBorder": "#50FA7B",
      "editorWhitespace.foreground": "#FFFFFF1A",
      "editorIndentGuide.background": "#FFFFFF1A",
      "editorIndentGuide.activeBackground": "#FFFFFF73",
      "editorRuler.foreground": "#FFFFFF1A",
      "editorOverviewRuler.border": "#191A21",
      "editorOverviewRuler.selectionHighlightForeground": "#FFB86C",
      "editorOverviewRuler.wordHighlightForeground": "#8BE9FD",
      "editorOverviewRuler.wordHighlightStrongForeground": "#50FA7B",
      "editorOverviewRuler.modifiedForeground": "#8BE9FDCC",
      "editorOverviewRuler.addedForeground": "#50FA7BCC",
      "editorOverviewRuler.deletedForeground": "#FF5555CC",
      "editorOverviewRuler.errorForeground": "#FF5555CC",
      "editorOverviewRuler.warningForeground": "#FFB86CCC",
      "editorOverviewRuler.infoForeground": "#8BE9FDCC",
      "editorError.foreground": "#FF5555",
      "editorWarning.foreground": "#8BE9FD",
      "editorGutter.modifiedBackground": "#8BE9FDCC",
      "editorGutter.addedBackground": "#50FA7BCC",
      "editorGutter.deletedBackground": "#FF5555CC",
      "editorMarkerNavigation.background": "#21222C",
      "editorOverviewRuler.currentContentForeground": "#50FA7B",
      "editorOverviewRuler.incomingContentForeground": "#BD93F9"
    },
    inherit: false,
    rules: [
      { token: "comment.php", foreground: "6272A4" },
      { token: "constant.php", foreground: "BD93F9" },
      { token: "identifier.php", foreground: "8BE9FD" },
      { token: "variable.predefined.php", foreground: "F8F8F2" },
      { token: "variable.php", foreground: "F8F8F2" },
      { token: "string.php", foreground: "F1FA8C" },
      { token: "number.php", foreground: "BD93F9" },
      { token: "number.binary.php", foreground: "BD93F9" },
      { token: "number.octal.php", foreground: "BD93F9" },
      { token: "number.hex.php", foreground: "BD93F9" },
      { token: "number.float.php", foreground: "BD93F9" },
      { token: "keyword.php", foreground: "FF79C6" },
      { token: "delimiter.php", foreground: "FF79C6" },
      { token: "delimiter.parenthesis.php", foreground: "F8F8F2" },
      { token: "delimiter.bracket.php", foreground: "F8F8F2" },
      { token: "delimiter.array.php", foreground: "F8F8F2" },
      { token: "string.escape.php", foreground: "FF79C6" },
      { token: "invalid", foreground: "F8F8F2" }
    ]
  });
}
