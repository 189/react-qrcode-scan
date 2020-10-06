
// http://rollupjs.org/guide/zh/
// https://github.com/rollup/plugins/tree/master/packages/node-resolve
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'lib',
        format: 'cjs',
        exports: "auto"
    },
    plugins: [
        resolve({
            preferBuiltins: true
        }),
        commonjs(),
        typescript(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    watch: {
        chokidar: true,
        include: "src/**"
    }
};