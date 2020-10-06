interface NodeRequire {
	(path: string): any;
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (
		paths: string[],
		callback: (require: <T>(path: string) => T) => void,
		name?: string
	) => void;
}

interface NodeModule {
	hot: any;
}
