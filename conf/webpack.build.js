const path = require("path");
const argv = require('minimist')(process.argv.slice(2));
const pkg = require("../package.json");

const { pro } = argv;

module.exports = {
	entry: path.resolve(__dirname, "../src/index.tsx"),
	resolve: {
		extensions: [".webpack.js", ".tsx", ".ts", ".jsx", ".js", ".scss"],
		modules: ["node_modules", "src"]
	},
	resolveLoader: {
		modules: ["node_modules", "src"]
	},
	devtool: pro ? false : "eval-source-map",
	mode: pro ? "production" : "development",
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "../dist"),
		library: pkg.name,
		libraryTarget: "umd",
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /.tsx?$/,
				exclude: path.resolve("node_modules"),
				use: [{ loader: "ts-loader", options: { transpileOnly: true } }]
			},
		]
	},
	externals: ["react", "react-dom"],
	node: {
		fs: "empty"
	}
};
