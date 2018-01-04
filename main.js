const {app, BrowserWindow, dialog} = require("electron")
const { autoUpdater } = require('electron-updater')
const isDev = require("electron-is-dev")
const settings = require("electron-settings")
const windowStateKeeper = require('electron-window-state')
const url = require("url")
const path = require("path")

let mainWindow

function createWindow () {
	
	if(!settings.has("editor.command")) {
		console.log(settings.set("editor", {
			command: "echo No command specified. Go to settings to specify a command."
		}))
	}
	
	// settings.deleteAll();

	let mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800
	})

	mainWindow = new BrowserWindow({
		'x': mainWindowState.x,
		'y': mainWindowState.y,
		'width': mainWindowState.width,
		'height': mainWindowState.height,
		show: false,
		center: true,
		icon: 'app/img/icon.png'
	})
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'app', 'index.html'),
		protocol: 'file:',
		slashes: true
	}))
	
	mainWindow.webContents.openDevTools()
	
	mainWindow.on('closed', () => {
		mainWindow = null
	})
	
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	mainWindowState.manage(mainWindow)

	autoUpdater.autoDownload = false

	autoUpdater.on('error', (event, error) => {
		dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
	})

	autoUpdater.on('update-available', () => {
		dialog.showMessageBox({
			type: 'info',
			title: 'Found Updates',
			message: 'Found updates, do you want update now?',
			buttons: ['Sure', 'No']
		}, (buttonIndex) => {
			if (buttonIndex === 0) {
				autoUpdater.downloadUpdate()
			}
			else {
				dialog.showMessageBox({
					type: "info",
					title: "Update aborted",
					message: "If you want to check for updates again, restart the app."
				})
			}
		})
	})

	autoUpdater.on('update-not-available', () => {
		dialog.showMessageBox({
		  title: 'No Updates',
		  message: 'Current version is up-to-date.'
		})
	})

	autoUpdater.on('update-downloaded', () => {
		dialog.showMessageBox({
		  title: 'Install Updates',
		  message: 'Updates downloaded, application will be quit for update...'
		}, () => {
		  setImmediate(() => autoUpdater.quitAndInstall())
		})
	})

	if(!isDev) {
		autoUpdater.updateConfigPath = path.join(APP_PATH, 'app-update.yml');
		autoUpdater.checkForUpdates()
	}
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') {
		app.quit()
	}
})
app.on('activate', () => {
	if(mainWindow === null) {
		createWindow()
	}
})