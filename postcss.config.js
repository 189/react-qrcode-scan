const autoprefixer = require("autoprefixer");
const postcssSimpleVars = require("postcss-simple-vars");
const postcssNested = require("postcss-nested");

module.exports = {
	sourceMap: true,
	plugins: [
		autoprefixer({
			browsers: ["last 2 versions"]
		}),
		postcssSimpleVars,
		postcssNested({
			bubble: ["phone"]
		})
	]
};
