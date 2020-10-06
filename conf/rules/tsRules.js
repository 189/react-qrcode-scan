const path = require("path");

module.exports = [
	{
		test: /.tsx?$/,
		exclude: path.resolve(__dirname, "node_modules"),
		use: [{ loader: "ts-loader", options: { transpileOnly: true } }]
	}
];
