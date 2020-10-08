const path = require("path");

const HTMLWebpackPlugin = require("html-webpack-plugin");

function resolve(filepath) {
	return path.resolve(__dirname, "..", filepath);
}

module.exports = {
	entry: {
		main: resolve("./example/mount.tsx")
	},
	resolve: {
		extensions: [".webpack.js", ".tsx", ".ts", ".jsx", ".js", ".scss"],
		modules: ["node_modules", "src"]
	},
	resolveLoader: {
		modules: ["node_modules", "src"]
	},
	devtool: "source-map",
	mode: "development",
	output: {
		filename: "[name].bundle.js",
		path: resolve("./dist/example")
	},
	module: {
		rules: [
			{
				test: /.tsx?$/,
				exclude: resolve("node_modules"),
				use: [{ loader: "ts-loader", options: { transpileOnly: true } }]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							modules: false,
						}
					}
				]
			},
		]
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: "./example/index.html",
			inject: "body",
			inlineSource: "runtime~main.*js$"
		})
	],
	node: {
		fs: "empty"
	}
};
