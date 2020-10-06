const path = require("path");
const webpack = require("webpack");
const { assign } = Object;
const argv = require("yargs").boolean("pro").argv;

const { execCommand } = require("./utils");
const webpackConfig = require("../conf/webpack.build");
const rootDir = path.resolve(__dirname, "..");

function compileTSFiles() {
	return execCommand("tsc", rootDir);
}

function genWebpackConfig() {
	const mode = argv.pro ? "production" : "development";
	const watch = !argv.pro;
	return assign({}, webpackConfig, { mode, watch });
}

function flush() {
	return execCommand("rm -rf ./lib");
}

function compileWebpack() {
	return new Promise((resolve, j) => {
		const conf = genWebpackConfig();
		webpack(conf, (err, stats) => {
			if (err) {
				j(err);
			} else if (stats.hasErrors()) {
				j(stats.toJson().errors.join("\n"));
			} else {
				process.stdout.write(
					stats.toString({
						colors: true,
						modules: false,
						children: false,
						chunks: false,
						chunkModules: false
					}) + "\n\n"
				);
				compileTSFiles().then(() => resolve(), err => j(err));
			}
		});
	});
}

async function compile() {
	await flush();
	await compileWebpack();
}

compile();
