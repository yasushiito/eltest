const path = require('path');
const outputPath = path.resolve(__dirname, 'build');

const rendererConfig = {
  mode: 'development',
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
module.exports = rendererConfig;
