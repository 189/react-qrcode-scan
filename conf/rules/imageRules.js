module.exports = [
	{
		test: /\.(png|jpg|svg|gif)$/,
		use: [
			{
				loader: "url-loader",
				options: {
					limit: 8192 * 1000
				}
			}
		]
	}
];
