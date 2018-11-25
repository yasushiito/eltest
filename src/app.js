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
  ipcRenderer.send('import');
});
document.getElementById('submit-tweet').addEventListener('click', (e) => {
  var msg = $('#message');
  var form = {
    message: msg.val()
  };
  ipcRenderer.send('tweet', form);
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
