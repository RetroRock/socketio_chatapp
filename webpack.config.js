const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: {
    app: ['@babel/polyfill', './src/index.js']
  },
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.html$/,
		  use: [
					 {
        				loader: 'html-loader',
					 	options: {
							minimize: true
						}
					 }
		  ],

      },
		{
			test: /\.scss$/,
				  use: [
							 MiniCssExtractPlugin.loader,
							 'css-loader',
							 {
								loader: 'sass-loader',
								options: {
									sassOptions: {
										includePaths: ['node_modules']
										.map((d) => path.join(__dirname, d))
										.map((g) => glob.sync(g))
										.reduce((a,c) => a.concat(c), [])	
									}	
								}
							 }
				  ]
		}
    ],
  },
  devServer: {
    port: 8080,
    inline: true,
    publicPath: '/',
    contentBase: [
				path.join(__dirname),
				path.join(__dirname, 'dist')
	 ],
    proxy: {
      '/': {
        target: 'http://localhost:8000/',
        secure: false,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
	 new MiniCssExtractPlugin({
		filename: '[name].css',
		chunkFilename: '[id].css'
	 })
  ]
};
