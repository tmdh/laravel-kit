import { editor, languages } from "monaco-editor";

languages.register({ id: "php-x" });
languages.setMonarchTokensProvider("php-x", {
  defaultToken: "",
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
      [/\\./, "string.escape.invalid.php"],
      [/"/, "string.php", "@pop"]
    ],

    phpSingleQuoteString: [
      [/[^\\']+/, "string.php"],
      [/@escapes/, "string.escape.php"],
      [/\\./, "string.escape.invalid.php"],
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

  phpPreDefinedVariables: ["$GLOBALS", "$_SERVER", "$_GET", "$_POST", "$_FILES", "$_REQUEST", "$_SESSION", "$_ENV", "$_COOKIE", "$php_errormsg", "$HTTP_RAW_POST_DATA", "$http_response_header", "$argc", "$argv"],

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
});

editor.defineTheme("atom-one-light", {
  base: "vs",
  colors: {
    "button.background": "#5871EF",
    "button.foreground": "#FFFFFF",
    "button.hoverBackground": "#6B83ED",
    "diffEditor.insertedTextBackground": "#00809B33",
    "dropdown.background": "#FFFFFF",
    "dropdown.border": "#DBDBDC",
    "editorIndentGuide.activeBackground": "#626772",
    "editor.background": "#FAFAFA",
    "editor.foreground": "#383A42",
    "editor.lineHighlightBackground": "#383A420C",
    "editor.selectionBackground": "#E5E5E6",
    "editorCursor.foreground": "#526FFF",
    "editor.findMatchHighlightBackground": "#526FFF33",
    "editorGroup.background": "#EAEAEB",
    "editorGroup.border": "#DBDBDC",
    "editorGroupHeader.tabsBackground": "#EAEAEB",
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
    "sideBar.background": "#EAEAEB",
    "sideBarSectionHeader.background": "#FAFAFA",
    "statusBar.background": "#EAEAEB",
    "statusBar.foreground": "#424243",
    "statusBarItem.hoverBackground": "#DBDBDC",
    "statusBar.noFolderBackground": "#EAEAEB",
    "tab.activeBackground": "#FAFAFA",
    "tab.activeForeground": "#121417",
    "tab.border": "#DBDBDC",
    "tab.inactiveBackground": "#EAEAEB",
    "titleBar.activeBackground": "#EAEAEB",
    "titleBar.activeForeground": "#424243",
    "titleBar.inactiveBackground": "#EAEAEB",
    "titleBar.inactiveForeground": "#424243",
    "statusBar.debuggingForeground": "#FFFFFF",
    "extensionButton.prominentBackground": "#3BBA54",
    "extensionButton.prominentHoverBackground": "#4CC263",
    "badge.background": "#526FFF",
    "badge.foreground": "#FFFFFF",
    "peekView.border": "#526FFF",
    "peekViewResult.background": "#EAEAEB",
    "peekViewResult.selectionBackground": "#DBDBDC",
    "peekViewTitle.background": "#FFFFFF",
    "peekViewEditor.background": "#FFFFFF"
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
