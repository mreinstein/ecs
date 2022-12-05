import esbuild  from 'esbuild'
import { http } from '@hyrious/esbuild-plugin-http'


const cfg = {
	entryPoints: [ 'app.js' ],
	allowOverwrite: true,
    bundle: true,
    format: 'esm',
    target: 'es2022',
    plugins: [
        http()
    ],
    outfile: 'app-bundle.js',
    minify: false,
    watch: false
}

esbuild.build(cfg)
