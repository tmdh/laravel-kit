const {app, BrowserWindow} = require("electron")
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
	
	// mainWindow.webContents.openDevTools()
	
	mainWindow.on('closed', () => {
		mainWindow = null
	})
	
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	mainWindowState.manage(mainWindow)
		
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