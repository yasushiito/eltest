var fs = require('fs');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;
var Twitter = require('twitter');
var Client = require('node-rest-client').Client;
const ElectronStore = require('electron-store');

let mainWindow = null;

var config = new ElectronStore({defaults: {}});
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('req', (event, arg) => {
  fs.readFile(__dirname + '/config/buttons.json', 'utf8', (err, data) => {
    if (err) throw err;
    event.sender.send('config-loaded', JSON.parse(data));
    var params = {
      consumer_key: config.get('consumer_key'),
      consumer_secret: config.get('consumer_secret'),
      access_token_key: config.get('access_token_key'),
      access_token_secret: config.get('access_token_secret')
    };
    event.sender.send('make-config', params);
    var params = {
      import_api_id: config.get('import_api_id')
    };
    event.sender.send('make-import', params);
  });
});
ipcMain.on('import', (event) => {
  var params = {
    data: {
      id: 'yas'
    },
    headers: {
      Content_Type: 'application/json'
    }
  };
  var client = new Client();
  let importApiId = config.get('import_api_id');
  let url = 'https://script.google.com/macros/s/' + importApiId + '/exec';
  client.post(url, params, function(data, response) {
    event.sender.send('update-message', data.content);
  });
});
ipcMain.on('tweet', (event, form) => {
  var auth = {
    consumer_key: config.get('consumer_key'),
    consumer_secret: config.get('consumer_secret'),
    access_token_key: config.get('access_token_key'),
    access_token_secret: config.get('access_token_secret')
  };
  console.dir(auth);
  var client = new Twitter(auth);
  var params = {status: form.message};
  client.post('statuses/update', params, function(error, tweet, response) {
    if (error) {
    // console.log(error);
      //console.log(response);
    }
  });
});
ipcMain.on('submit', (event, params) => {
  config.set('consumer_key', params.consumer_key);
  config.set('consumer_secret', params.consumer_secret);
  config.set('access_token_key', params.access_token_key);
  config.set('access_token_secret', params.access_token_secret);
});
ipcMain.on('submit-doc', (event, params) => {
  config.set('import_api_id', params.import_api_id);
});
app.on('ready', function() {
  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({x: 0, y: 0, width: 800, height: 600, alwaysOnTop: true});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.toggleDevTools();
  
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

