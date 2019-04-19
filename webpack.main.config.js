//const path = require('path');
//const rootPath = path.resolve(__dirname);

const mainConfig = {
  mode: 'development',
  target: 'electron-main',
  entry: ['./src/main.js'],
  output: {
    path:__dirname+'build/',
    filename: 'bmain.js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  externals: {
    //'electron': "require('electron')"
  }
}
module.exports = mainConfig;
