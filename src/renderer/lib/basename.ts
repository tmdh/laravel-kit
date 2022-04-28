// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 *
 * Node.js path.basename() ported for browser
 *
 * @param {string} path
 * @returns {string}
 */
export default function (path: string) {
  let start = 0;
  let end = -1;
  let matchedSlash = true;

  // Check for a drive letter prefix so as not to mistake the following
  // path separator as an extra separator at the end of the path that can be
  // disregarded
  if (path.length >= 2 && isWindowsDeviceRoot(path.charAt(0)) && path.charAt(1) === ":") {
    start = 2;
  }

  for (let i = path.length - 1; i >= start; --i) {
    if (isPathSeparator(path.charAt(i))) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        start = i + 1;
        break;
      }
    } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return "";
  return path.slice(start, end);
}

function isPathSeparator(char: string) {
  return char === "/" || char === "\\";
}

function isWindowsDeviceRoot(char: string) {
  return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
}
