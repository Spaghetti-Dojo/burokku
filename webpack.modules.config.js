const path = require('path');
/** @type {import('webpack').Configuration} */
const [scriptsConfig, modulesConfig] = require('@wordpress/scripts/config/webpack.config');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// Merge explicit, non-block script entries with the auto-discovered block
// entries (the original `entry` is a function that scans for `block.json`).
const baseEntry = scriptsConfig.entry;
const scriptEntry = () => ({
	...(typeof baseEntry === 'function' ? baseEntry() : baseEntry),
	'editor/scheme-preview/index': path.resolve(
		__dirname,
		'sources/editor/scheme-preview/index.tsx'
	),
});

module.exports = [
	{
		...scriptsConfig,
		entry: scriptEntry,
		resolve: {
			...(scriptsConfig.resolve || {}),
			alias: {
				'@burokku/mixins': path.resolve(__dirname, 'sources/client/styles/mixins'),
			},
		},
		output: {
			...scriptsConfig.output,
			path: path.resolve(__dirname, 'dist/modules')
		}
	},
	{
		...modulesConfig,
		output: {
			...modulesConfig.output,
			path: path.resolve(__dirname, 'dist/modules')
		}
	}
];
