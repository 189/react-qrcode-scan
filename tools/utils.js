const { exec } = require("child_process");

exports.execCommand = function(command, cwd) {
	return new Promise((resolve, reject) => {
		exec(
			command,
			{
				cwd,
				maxBuffer: 20 * 1024 * 1024
			},
			(err, stdout, stderr) => {
				if (err) {
					reject(stderr);
				} else {
					resolve(stdout || stderr);
				}
			}
		);
	});
};
