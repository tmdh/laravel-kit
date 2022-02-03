/*

  MIT License

  Copyright (c) 2018 Peter Krumins

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*/
import { spawnSync as spawn, execSync as exec } from "child_process";

export default function (pid, signal) {
  pid = parseInt(pid);
  if (Number.isNaN(pid)) {
    throw new Error("killSync: pid must be a number");
  }

  var tree = {};
  var pidsToProcess = {};
  tree[pid] = [];
  pidsToProcess[pid] = 1;

  switch (process.platform) {
    case "win32":
      exec("taskkill /pid " + pid + " /T /F");
      break;
    case "darwin":
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        function (parentPid) {
          return spawn("pgrep", ["-P", parentPid]);
        },
        function () {
          killAll(tree, signal);
        }
      );
      break;
    default:
      // Linux
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        function (parentPid) {
          return spawn("ps", ["-o", "pid", "--no-headers", "--ppid", parentPid]);
        },
        function () {
          killAll(tree, signal);
        }
      );
      break;
  }
}

function killAll(tree, signal) {
  var killed = {};
  Object.keys(tree).forEach(function (pid) {
    tree[pid].forEach(function (pidpid) {
      if (!killed[pidpid]) {
        killPid(pidpid, signal);
        killed[pidpid] = 1;
      }
    });
    if (!killed[pid]) {
      killPid(pid, signal);
      killed[pid] = 1;
    }
  });
}

function killPid(pid, signal) {
  try {
    process.kill(parseInt(pid, 10), signal);
  } catch (err) {
    if (err.code !== "ESRCH") throw err;
  }
}

function buildProcessTree(parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
  var ps = spawnChildProcessesList(parentPid);
  var allData = ps.stdout.toString();
  var code = ps.status;
  delete pidsToProcess[parentPid];

  if (code != 0) {
    // no more parent processes
    if (Object.keys(pidsToProcess).length == 0) {
      cb();
    }
    return;
  }

  allData.match(/\d+/g).forEach(function (pid) {
    pid = parseInt(pid, 10);
    tree[parentPid].push(pid);
    tree[pid] = [];
    pidsToProcess[pid] = 1;
    buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
  });
}
