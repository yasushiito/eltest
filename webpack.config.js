const path = require('path');
const outputPath = path.resolve(__dirname, 'build');
const rootPath = path.resolve(__dirname);

const mainConfig = {
  target: 'electron-main',
  entry: './src/main.js',
  output: {
    path: rootPath,
    filename: 'main.js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  externals: {
    'electron': "require('electron')"
  }
}
const rendererConfig = {
  target: 'electron-renderer',
  entry: './src/app.js',
  output: {
    path: outputPath,
    filename: 'app.js'
  },
  externals: {
    'electron': "require('electron')"
  }
}
module.exports = [mainConfig, rendererConfig];
