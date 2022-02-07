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
import { spawnSync, execSync, SpawnSyncReturns } from "child_process";

type Tree = Record<number, Array<number>>;
type PidsToProcess = Record<number, number>;

export default function (pid: number, signal: string) {
  var tree: Tree = {};
  var pidsToProcess: PidsToProcess = {};
  tree[pid] = [];
  pidsToProcess[pid] = 1;

  switch (process.platform) {
    case "win32":
      execSync("taskkill /pid " + pid + " /T /F");
      break;
    case "darwin":
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        function (parentPid) {
          return spawnSync("pgrep", ["-P", parentPid.toString()]);
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
          return spawnSync("ps", ["-o", "pid", "--no-headers", "--ppid", parentPid.toString()]);
        },
        function () {
          killAll(tree, signal);
        }
      );
      break;
  }
}

function killAll(tree: Tree, signal: string) {
  var killed: Record<number, number> = {};
  const k = Object.keys(tree);
  k.forEach(function (pid) {
    const pidInt = parseInt(pid, 10);
    tree[pidInt].forEach(function (pidpid) {
      if (!killed[pidpid]) {
        killPid(pidpid, signal);
        killed[pidpid] = 1;
      }
    });
    if (!killed[pidInt]) {
      killPid(pidInt, signal);
      killed[pidInt] = 1;
    }
  });
}

function killPid(pid: number, signal: string) {
  try {
    process.kill(pid, signal);
  } catch (err: any) {
    if (err.code !== "ESRCH") throw err;
  }
}

function buildProcessTree(parentPid: number, tree: Tree, pidsToProcess: PidsToProcess, spawnChildProcessesList: (pid: number) => SpawnSyncReturns<Buffer>, cb: () => void) {
  var ps = spawnChildProcessesList(parentPid);
  var pids = ps.stdout.toString().match(/\d+/g);
  var code = ps.status;
  delete pidsToProcess[parentPid];

  if (code != 0) {
    // no more parent processes
    if (Object.keys(pidsToProcess).length == 0) {
      cb();
    }
    return;
  }

  if (pids) {
    pids.forEach(function (pidString) {
      let pid = parseInt(pidString, 10);
      tree[parentPid].push(pid);
      tree[pid] = [];
      pidsToProcess[pid] = 1;
      buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
    });
  }
}
