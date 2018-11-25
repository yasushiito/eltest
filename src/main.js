const fs = require('fs');
const path = require('path');
const electron = require('electron');
const ElectronStore = require('electron-store');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;
import Tweet from './main/tweet';
import Dictionary from './main/dictionary';

require('./import_doc');

let mainWindow = null;

var config = new ElectronStore({defaults: {}});
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('req', (event, arg) => {
  let fn = path.resolve(__dirname, 'config') + '/buttons.json';
  fs.readFile(fn, 'utf8', (err, data) => {
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
    var params = {
      dictionary: config.get('dictionary')
    };
    event.sender.send('make-dictionary', params);
  });
});
ipcMain.on('tweet', (event, form) => {
  var auth = {
    consumer_key: config.get('consumer_key'),
    consumer_secret: config.get('consumer_secret'),
    access_token_key: config.get('access_token_key'),
    access_token_secret: config.get('access_token_secret')
  };
  var tweet = new Tweet(auth);
  var dictionary = new Dictionary([['ハローワールド', 'Hello, world!']]);
  let lines = form.message.split("\n");
  var msgs = tweet.simple(lines, dictionary);
  for(let i = 0;i < msgs.length;i++){
    tweet.post(msgs[i]);
   
  }
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
ipcMain.on('submit-dic', (event, params) => {
  config.set('dictionary', params.dictionary);
});
app.on('ready', function() {
  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({x: 0, y: 250, width: 200, height: 650, alwaysOnTop: true});
  mainWindow.loadFile('index.html');
  // mainWindow.toggleDevTools();
  
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

