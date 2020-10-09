const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../conf/webpack.example");
const open = require("open");

const devPort = 8898;
const compiler = Webpack(webpackConfig);
const devServerOptions = Object.assign({}, webpackConfig.devServer, {
	open: true,
	stats: {
		colors: true,
	},
});
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(devPort, "127.0.0.1", () => {
	console.log("Starting server on http://localhost:" + devPort);
	open("http://localhost:" + devPort);
});
