/*
    https://github.com/pkrumins/node-tree-kill/blob/master/index.js
*/
import { spawnSync as spawn, execSync as exec } from "child_process";

export default function (pid, signal, callback) {
  if (typeof signal === "function" && callback === undefined) {
    callback = signal;
    signal = undefined;
  }

  pid = parseInt(pid);
  if (Number.isNaN(pid)) {
    if (callback) {
      return callback(new Error("pid must be a number"));
    } else {
      throw new Error("pid must be a number");
    }
  }

  var tree = {};
  var pidsToProcess = {};
  tree[pid] = [];
  pidsToProcess[pid] = 1;

  switch (process.platform) {
    case "win32":
      exec("taskkill /pid " + pid + " /T /F", callback);
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
          killAll(tree, signal, callback);
        }
      );
      break;
    // case 'sunos':
    //     buildProcessTreeSunOS(pid, tree, pidsToProcess, function () {
    //         killAll(tree, signal, callback);
    //     });
    //     break;
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
          killAll(tree, signal, callback);
        }
      );
      break;
  }
}

function killAll(tree, signal, callback) {
  var killed = {};
  try {
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
  } catch (err) {
    if (callback) {
      return callback(err);
    } else {
      throw err;
    }
  }
  if (callback) {
    return callback();
  }
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
  var allData = "";
  ps.stdout.on("data", function (data) {
    allData += data.toString("ascii");
  });

  var onClose = function (code) {
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
  };

  ps.on("close", onClose);
}
