const fs = require('fs');
const path = require('path');
const electron = require('electron');
const ElectronStore = require('electron-store');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;
const {clipboard} = require('electron');
const { exec } = require('child_process');
import {ipcRenderer} from 'electron';
import Tweet from './main/tweet';
import Dictionary from './main/dictionary';

require('./import_doc');

let mainWindow = null;

var config = new ElectronStore({defaults: {}});
var dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
var dir_script = require("path").join(dir_home, '\\Documents\\autohotkey');
var ahkexe = '"c:\\Program Files\\AutoHotkey\\AutoHotkey.exe"'
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
var executeAhk = (filename) => {
  var script = '"' + dir_script + '\\' + filename + '"'
  var cmd = ahkexe + ' ' + script
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}
// はてなブログの新規エントリーを用意する。
ipcMain.on('blogentry', (event) => {
  executeAhk('call_winins.ahk');
});
// ;作業用ウィンドウで開いているページを編集中のブログにリンク挿入する。
ipcMain.on('blogrefemb', (event) => {
  executeAhk('call_wineql.ahk');
});
// 作業用ウィンドウで開いているページを編集中のブログに選択文字列でリンク挿入する 。
ipcMain.on('blogrefsel', (event) => {
  executeAhk('call_winsfteql.ahk');
});
// 作業用ウィンドウで開いている Amazon の商品をブログに挿入する。
ipcMain.on('blogamazon', (event) => {
  executeAhk('call_blogasin.ahk');
});
// 作業用ウィンドウで開いているGitHubのソースコードをブログに挿入する。
ipcMain.on('bloggithub', (event) => {
  executeAhk('call_winctrleql.ahk');
});
// Google Chrome に表示されているページをはてブする 。
ipcMain.on('hatebucrm', (event) => {
  executeAhk('call_win2.ahk');
});
// Firefox で表示しているページをはてブする 。
ipcMain.on('hatebufox', (event) => {
  executeAhk('call_winsft2.ahk');
});
// 主要ツールのウィンドウ位置とサイズを調整する。
ipcMain.on('adjust', (event) => {
  executeAhk('call_winsfthome.ahk');
});
// スクリーンキーボードなどを左に配置する。
ipcMain.on('toolleft', (event) => {
  executeAhk('call_winsfthome.ahk');
});
//
ipcMain.on('toolleft', (event) => {
  executeAhk('call_winsfthome.ahk');
});
//新規タブで Google 音声検索する。
ipcMain.on('googlesearch', (event) => {
  executeAhk('call_winhome.ahk');
});
ipcMain.on('tweet', (event, form) => {
  var auth = {
    consumer_key: config.get('consumer_key'),
    consumer_secret: config.get('consumer_secret'),
    access_token_key: config.get('access_token_key'),
    access_token_secret: config.get('access_token_secret')
  };
  var tweet = new Tweet(auth);
  var words = config.get('dictionary').split("\n");
  var dic = words.map((value, index, array) => {return value.split("\t")});
  var dictionary = new Dictionary(dic);
  let lines = form.message.split("\n");
  var msgs = tweet.simple(lines, dictionary);
  for(let i = 0;i < msgs.length;i++){
    tweet.post(msgs[i]);
  }
});
// Textarea のテキストをクリップボードに転送する 。
ipcMain.on('setclip', (event, form) => {
  var tweet = new Tweet(null);
  var words = config.get('dictionary').split("\n");
  var dic = words.map((value, index, array) => {return value.split("\t")});
  var dictionary = new Dictionary(dic);
  let lines = form.message.split("\n");
  var msgs = tweet.clip(lines, dictionary);
  clipboard.writeText(msgs.join("\n"));
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
  mainWindow = new BrowserWindow({x: 110, y: 250, width: 360, height: 250, alwaysOnTop: true});
  mainWindow.loadFile('index.html');
  //mainWindow.toggleDevTools();
  
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
