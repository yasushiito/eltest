const ipcMain = require('electron').ipcMain;
var Client = require('node-rest-client').Client;
const ElectronStore = require('electron-store');
var config = new ElectronStore({defaults: {}});

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
