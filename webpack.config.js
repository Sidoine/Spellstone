// const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {  
  entry: './index.ts',
  output: {
    path: 'dist',
    filename: 'index.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.(html|json)$/, loader: 'raw-loader' },
    //  { test: /\.scss$/, loader: extractTextPlugin.extract('style-loader', 'css-loader!sass-loader') }
    ]
  },
  plugins: [
    //  new extractTextPlugin('[name].css')  
  ],    
  devtool: 'source-map'
}
