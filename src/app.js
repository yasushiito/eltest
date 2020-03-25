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
  //Google Script 経由で音声入力テキストをテキストエリアに取り込む場合。
  ipcRenderer.send('import', 'toclip');
});
// 音声入力されたテキストを Facebook メッセンジャーに貼り付ける。
document.getElementById('portmessenger').addEventListener('click', (e) => {
  ipcRenderer.send('portmessenger');
});
//クリップボードの内容を変換して入れ直す
document.getElementById('translate').addEventListener('click', (e) => {
  ipcRenderer.send('translate');
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
// 作業用ウィンドウで開いている Amazon の商品をブログに挿入する。
document.getElementById('blogamazon').addEventListener('click', (e) => {
  ipcRenderer.send('blogamazon');
});
// 作業用ウィンドウで開いているGitHubのソースコードをブログに挿入する。
document.getElementById('bloggithub').addEventListener('click', (e) => {
  ipcRenderer.send('bloggithub');
});
// Google Chrome に表示されているページをはてブする 。
document.getElementById('hatebucrm').addEventListener('click', (e) => {
  ipcRenderer.send('hatebucrm');
});
// Firefox で表示しているページをはてブする 。
document.getElementById('hatebufox').addEventListener('click', (e) => {
  ipcRenderer.send('hatebufox');
});
// 主要ツールのウィンドウ位置とサイズを調整する。
document.getElementById('adjust').addEventListener('click', (e) => {
  ipcRenderer.send('adjust');
});
// ステップ記録ツールのスクリーンショットを開く。
document.getElementById('extractpsr').addEventListener('click', (e) => {
  ipcRenderer.send('extractpsr');
});
//
document.getElementById('toolright').addEventListener('click', (e) => {
  ipcRenderer.send('toolright');
});
// Bluetooth 機器が接続されていることを確認する。
document.getElementById('btconn').addEventListener('click', (e) => {
  ipcRenderer.send('btconn');
});
//Radiko でなんちゃらする。
document.getElementById('radiko').addEventListener('click', (e) => {
  ipcRenderer.send('radiko');
});
//新規タブで Google 音声検索する。
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
//^c 音声入力テキストコピペで textarea に移すショートカット。
//クリップボードにテキストが入っている前提で呼び出される。
//テキストを取り出して toclip と同じ処理を行えば擬似的にクリップボードボタンをトレースできる。
$(document).keydown(function(e){
  if (event.ctrlKey) {
    if (e.keyCode === 67) {
      document.getElementById('translate').click();
    }
  }
});
//^d
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
