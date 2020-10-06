module.exports = [
	{
		test: /\.(css|scss)$/,
		use: [
			//MiniCssExtractPlugin.loader,
			{
				loader: "style-loader"
			},
			{
				loader: "css-loader",
				options: {
					// minimize: true,
					modules: true,
					localIdentName: "[name]_[local]_[hash:base64:5]"
				}
			},
			{
				loader: "sass-loader",
				options: {
					outputStyle: "expanded",
					sourceMap: true
				}
			}
		]
	},
	{
		test: /\.(woff(2)?|ttf|otf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		use: [
			{
				loader: "file-loader",
				options: {
					name: "fonts/webpack/[name].[hash].[ext]"
				}
			}
		]
	}
];
