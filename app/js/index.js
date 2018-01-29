const {remote, shell} = require('electron')
const {Menu, MenuItem, dialog, app} = remote
const fs = require("fs")
const {exec, spawn} = require("child_process")
const extract = require('extract-zip')
const settings = require("electron-settings")
const kill = require('tree-kill')
var statusbar = $(".status-bar"), serveBtn = $("#serve.serve"), servingBtn = $("#serve.serving")
var projectPath = ""
var serve


const template = [
	{
		label: 'Edit',
		submenu: [
			{role: 'undo'},
			{role: 'redo'},
			{type: 'separator'},
			{role: 'cut'},
			{role: 'copy'},
			{role: 'paste'},
			{role: 'pasteandmatchstyle'},
			{role: 'delete'},
			{role: 'selectall'}
		]
	},
	{
		label: 'View',
		submenu: [
			{role: 'reload'},
			{role: 'forcereload'},
			{role: 'toggledevtools'},
			{type: 'separator'},
			{role: 'resetzoom'},
			{role: 'zoomin'},
			{role: 'zoomout'},
			{type: 'separator'},
			{role: 'togglefullscreen'}
		]
	},
	{
		role: 'window',
		submenu: [
			{role: 'minimize'},
			{role: 'close'}
		]
	},
	{
		role: "help",
		submenu: [
			{
				label: "Laravel Kit on GitHub",
				click() { goto('https://github.com/tarequemdhanif/laravel-kit') }
			},
			{
				label: "Wiki",
				click() { goto('https://github.com/tarequemdhanif/laravel-kit/wiki') }
			},
			{
				label: "Releases",
				click() { goto('https://github.com/tarequemdhanif/laravel-kit/releases') }
			},
			{
				label: "Report an issue",
				click() { goto('https://github.com/tarequemdhanif/laravel-kit/issues/new') }
			},
			{
				label: "License",
				click() { goto('https://github.com/tarequemdhanif/laravel-kit/blob/master/LICENSE') }
			},
			{
				type: "separator"
			},
			{
				label: "Support on Patreon",
				click() { goto("https://www.patreon.com/tarequemdhanif") }
			},
			{
				label: "Donate",
				click() { goto("https://paypal.me/tarequemdhanif") }
			}
		]
	}
]

if(process.platform === "darwin") {
	template.unshift({
		label: "Laravel Kit",
		submenu: [
			{
				label: "About",
				click() {
					dialog.showMessageBox({
						type: "info",
						title: "Laravel Kit",
						message: "Laravel Kit",
						detail: "Version " + app.getVersion() + "\nNode " + process.version + "\nArchitecture " + process.arch
					})
				}
			},
			{
				type: "separator"
			},
			,
			{
				label: "Exit",
				role: "quit"
			}
		]
	},
	{
		label: "Project",
		submenu: [
			{
				label: "New Project",
				accelerator: 'CmdOrCtrl+N',
				click() { newProject() }
			},
			{
				label: "Open Project",
				accelerator: 'CmdOrCtrl+O',
				click() { openProjectPre() }
			}
		]
	}
)
} else {
	template.unshift({
		label: "Project",
		submenu: [
			{
				label: "New Project",
				accelerator: 'CmdOrCtrl+N',
				click() { newProject() }
			},
			{
				label: "Open Project",
				accelerator: 'CmdOrCtrl+O',
				click() { openProjectPre() }
			},
			{
				type: "separator"
			},
			,
			{
				label: "About",
				click() {
					dialog.showMessageBox({
						type: "info",
						title: "Laravel Kit",
						message: "Laravel Kit",
						detail: "Version " + app.getVersion() + "\nNode " + process.version + "\nArchitecture " + process.arch
					})
				}
			},
			{
				label: "Exit",
				role: "quit"
			}
		]
	})
}


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu);

$(document).ready(function () {
	$("#editorcmd").val(settings.get("editor.command"))
});

$(".pr-name, .sidebar > ul > li").click(function () {
	if(!$(this).hasClass("active")) {
		var oldContent = $(".active").attr("content")
		$(".active").removeClass("active");
		$(this).addClass("active");
		var newContent = $(this).attr("content");
		$("." + oldContent).hide();
		$("." + newContent).show();
	}
});

$("button.cmd").click(function () {
	var command = $(this).attr("cmd");
	var fullCommand = "php artisan " + command;
	var container = $(this).parent().parent();
	container.find("input.option[type='checkbox']").each(function () {
		if($(this).is(":checked")) {
			fullCommand += " " + $(this).attr("option");
		}
	});
	container.find("input.arg[type='text']").each(function () {
		if($(this).val()) {
			fullCommand += " " + $(this).val();
		}
	});
	container.find("input.option[type='text']").each(function () {
		if($(this).val()) {
			fullCommand += " " + $(this).attr("option") + "=" + $(this).val();
		}
	});
	fullCommand += " -n";
	changeStatusToWait("");
	execute(fullCommand, projectPath, function (status) {
		changeStatus(status);
	})
});

serveBtn.click(function () {
	serve = spawn("php", ["artisan", "serve"], { cwd: projectPath });
	$(this).hide();
	servingBtn.show();
	changeStatus("Serving...");
});

servingBtn.click(function () {
	kill(serve.pid, 'SIGKILL', function(err) {
		if(err) {
			alert(err);
			console.log(err);
		} else {
			changeStatusToBSA();
			servingBtn.hide();
			serveBtn.show();
		}
	});
});

$("#showInExpBtn").click(function () {
	showInExplorer();
});

$("#saveSettings").click(function () {
	settings.set("editor", {
		command: $("#editorcmd").val()
	})
	changeStatus("Settings saved!");
})

$("#openInEditor").click(function () {
	openInEditor()
})

function ae (error) {
	dialog.showErrorBox("Error", error);
}

function newProject () {
	dialog.showOpenDialog({
		title: "New Project",
		buttonLabel: "Create",
		properties: ["openDirectory", "createDirectory"]
	}, (folderPath) => {
		if(folderPath !== undefined) {
			extract('app/zip/laravel-5.5.zip', {dir: folderPath[0]}, (err) => {
				if(err !== undefined) {
					ae(err)
				} else {
					changeStatusToWait("Extracted Laravel 5.5")
					var vendorZips = []
					fs.readdirSync("app/zip/vendors-5.5/").forEach(zipFile => {
					 	vendorZips.push(zipFile)
					})
					var extractCount = 0
					for(var i = 0; i < vendorZips.length; i++) {
						extract('app/zip/vendors-5.5/' + vendorZips[i], {dir: folderPath[0] + '/vendor'}, (err) => {
							if(err !== undefined) {
								changeStatus(err)
								ae(err)
							} else {
								extractCount++
								changeStatusToWait("Extracted " + extractCount + "/34 vendor(s)")
								if(extractCount === vendorZips.length) {
									executeCommands(folderPath[0])
								}
							}
						})
					}
				}
			})
		}
	})
}

function openProjectPre () {
	dialog.showOpenDialog({
		title: "Open Project",
		buttonLabel: "Open",
		properties: ["openDirectory", "createDirectory"]
	}, (folderPath) => {
		if(folderPath !== undefined) {
			openProject(folderPath[0])
		}
	})
}

function openProject (folderPath) {
	changeStatus("Opening...")
	exec("php artisan -V", { cwd: folderPath }, function (error, stdout, stderr) {
		if(error !== null) {
			ae("Not a valid Laravel Project");
		} else {
			projectPath = folderPath;
			$(".welcome").addClass("no-display");
			$(".workspace").removeClass("no-display");
			$(".pr-name").text(getProjectName(projectPath));
			changeStatus("Build something amazing!");
			var oldContent = $(".active").attr("content")
			$(".active").removeClass("active");
			$(".pr-name").addClass("active");
			$("." + oldContent).hide();
			$(".main").show();
			$("input[type=text]:not(#editorcmd)").val("");
		}
	})
}

function changeStatus (status) {
	statusbar.text(status)
}

function changeStatusToWait (status) {
	changeStatus("Please Wait... " + status)
}

function changeStatusToBSA () {
	changeStatus("Build something amazing!")
}

function execute (command, dir, callback) {
	console.log(command)
	exec(command, { cwd: dir }, (error, stdout, stderr) => {
		if(error !== null) {
			ae(stdout)
			changeStatusToBSA()
		} else {
			callback(stdout)
		}
		console.log(stdout)
	})
}

function executeCommands (dir) {
	changeStatus("Creating environment file...")
	execute("composer run-script post-root-package-install", dir, (output) => {
		if(output === "") {
			changeStatus("Environment file created. Generating application key...")
			execute("composer dumpautoload", dir, (output) => {
				if(output.includes("Package manifest generated successfully.", -1)) {
					execute("composer run-script post-create-project-cmd", dir, (output) => {
					if(output.includes("Application key", 0) && output.includes("set successfully.", -1)) {
						changeStatus("Application key generated successfully. Generating optimized class loader...")
						execute("composer run-script post-autoload-dump", dir, (output) => {
							if(output.includes("Package manifest generated successfully.", -1)) {
								openProject(dir)
							}
						})
					}
				})
				}
			})
		}
	})
}

function getProjectName (dir) {
	var array = dir.split("\\");
	return array[array.length - 1]
}

function showInExplorer () {
	shell.showItemInFolder(projectPath + "\\app")
}

function openInEditor () {
	execute(settings.get("editor.command"), projectPath, (output) => {
		changeStatus(output)
	})
}

function goto (link) {
	shell.openExternal(link)
}