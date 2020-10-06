const path = require("path");
const { tsRules, styleRules, imgRules } = require("./rules");
const argv = require('minimist')(process.argv.slice(2));
const pkg = require("../package.json");

const { pro } = argv;

module.exports = {
	entry: path.resolve(__dirname, "../src/index.ts"),
	resolve: {
		extensions: [".webpack.js", ".tsx", ".ts", ".jsx", ".js", ".scss"],
		modules: ["node_modules", "src"]
	},
	resolveLoader: {
		modules: ["node_modules", "src"]
	},
	devtool: pro ? false : "inline-sourcemap",
	mode: pro ? "production" : "development",
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "../dist"),
		library: pkg.name,
		libraryTarget: "umd",
		umdNamedDefine: true
	},
	module: {
		rules: [...imgRules, ...tsRules, ...styleRules]
	},
	externals: ["react", "react-dom"],
	node: {
		fs: "empty"
	}
};
