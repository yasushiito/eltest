var $ = require('jQuery');
import {ipcRenderer} from 'electron';
import {Buttons} from './buttons';

var el = document.getElementById('buttons');
ipcRenderer.on('config-loaded', (event, arg) => {
  let buttons = new Buttons(arg);
  el.innerHTML = buttons.html();
});
ipcRenderer.send('req', 'hoge');
ipcRenderer.on('make-config', (event, config) => {
  var consumer_key = $('#config-consumer-key');
  var consumer_secret = $('#config-consumer-secret');
  var access_token_key = $('#config-access-token-key');
  var access_token_secret = $('#config-access-token-secret');
  consumer_key.val(config.consumer_key);
  consumer_secret.val(config.consumer_secret);
  access_token_key.val(config.access_token_key);
  access_token_secret.val(config.access_token_secret);
});
ipcRenderer.on('make-import', (event, config) => {
  var import_api_id = $('#config-import-api-id');
  import_api_id.val(config.import_api_id);
});
ipcRenderer.on('make-dictionary', (event, config) => {
  $('#dictionary').val(config.dictionary);
});
document.getElementById('submit-import').addEventListener('click', (e) => {
  ipcRenderer.send('import', 'update-message');
});
document.getElementById('submit-toclip').addEventListener('click', (e) => {
  ipcRenderer.send('import', 'toclip');
});
//
document.getElementById('simple-tweet').addEventListener('click', (e) => {
  ipcRenderer.send('import', 'update-message');
});
document.getElementById('clipboard').addEventListener('click', (e) => {
  ipcRenderer.send('import', 'toclip');
});
// はてなブログの新規エントリーを用意する。
document.getElementById('blogentry').addEventListener('click', (e) => {
  ipcRenderer.send('blogentry');
});
// ;作業用ウィンドウで開いているページを編集中のブログにリンク挿入する。
document.getElementById('blogrefemb').addEventListener('click', (e) => {
  ipcRenderer.send('blogrefemb');
});
// 作業用ウィンドウで開いているページを編集中のブログに選択文字列でリンク挿入する 。
document.getElementById('blogrefsel').addEventListener('click', (e) => {
  ipcRenderer.send('blogrefsel');
});
// Google Chrome に表示されているページをはてブする 。
document.getElementById('hatebucrm').addEventListener('click', (e) => {
  ipcRenderer.send('hatebucrm');
});
// Firefox で表示しているページをはてブする 。
document.getElementById('hatebufox').addEventListener('click', (e) => {
  ipcRenderer.send('hatebufox');
});
// スクリーンキーボードなどを右に配置する。
document.getElementById('toolright').addEventListener('click', (e) => {
  ipcRenderer.send('toolright');
});
// スクリーンキーボードなどを左に配置する。
document.getElementById('toolleft').addEventListener('click', (e) => {
  ipcRenderer.send('toolleft');
});
//
document.getElementById('googlesearch').addEventListener('click', (e) => {
  ipcRenderer.send('googlesearch');
});
// 音声入力ドキュメントに書かれたテキストをインポートできたらメッセージ送信される 
ipcRenderer.on('update-message', (event, message) => {
  let msg = $('#message');
  msg.val(message);
  var form = {
    message: message
  };
  event.sender.send('tweet', form)
});
// 音声入力文書からのインポートが終了したら呼び出される 。
ipcRenderer.on('toclip', (event, message) => {
  // メッセージフォームにダウンロードされたテキストをクリップボードにうつしてもらう 。
  let msg = $('#message');
  msg.val(message);
  var form = {
    message: message
  };
  event.sender.send('setclip', form)
});
var btn = document.getElementById('submit-config');
btn.addEventListener('click', (e) => {
  var consumer_key = $('#config-consumer-key');
  var consumer_secret = $('#config-consumer-secret');
  var access_token_key = $('#config-access-token-key');
  var access_token_secret = $('#config-access-token-secret');
  var params = {
    consumer_key: consumer_key.val(),
    consumer_secret: consumer_secret.val(),
    access_token_key: access_token_key.val(),
    access_token_secret: access_token_secret.val()
  };
  ipcRenderer.send('submit', params);
});
var btn = document.getElementById('submit-doc');
btn.addEventListener('click', (e) => {
  var import_api_id = $('#config-import-api-id');
  var params = {
    import_api_id: import_api_id.val()
  };
  ipcRenderer.send('submit-doc', params);
});
document.getElementById('submit-dictionary').addEventListener('click', (e) => {
  var dic = $('#dictionary');
  var form = {
    dictionary: dic.val()
  };
  ipcRenderer.send('submit-dic', form);
});
$(document).keydown(function(e){
  if (event.ctrlKey) {
    if (e.keyCode === 68) {
      document.getElementById('clipboard').click();
    }
  }
});
$(document).keydown(function(e){
  if (event.ctrlKey) {
    if (e.keyCode === 84) {
      document.getElementById('simple-tweet').click();
    }
  }
});
