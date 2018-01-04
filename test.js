/*
const {spawn} = require("child_process")
var terminate = require('terminate');

var c = spawn("php", ["artisan", "serve"], {
    cwd: "C:/Users/DELL/Laravel Projects/lktest3"
})
setTimeout(() => {
    // c.kill('SIGINT')
    console.log("After 5 seconds")
    console.log(c.killed)
    terminate(c.pid, function (err) {
      if (err) { // you will get an error if you did not supply a valid process.pid 
        console.log("Oopsy: " + err); // handle errors in your preferred way. 
      }
      else {
        console.log('done'); // terminating the Processes succeeded. 
        console.log(c.killed)
      }
    });
}, 5000)
*/
/*
const {spawn} = require("child_process")
var kill = require('tree-kill');

var c = spawn("php", ["artisan", "serve"], {
    cwd: "C:/Users/DELL/Laravel Projects/lktest3"
})
setTimeout(() => {
    // c.kill('SIGINT')
    console.log("After 5 seconds")
    console.log(c.killed)
    kill(c.pid, 'SIGKILL', function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log("Terminated!")
            console.log(c.killed)
        }
    });
}, 5000)
*/