const path = require('path');
/** @type {import('webpack').Configuration} */
const [scriptsConfig, modulesConfig] = require('@wordpress/scripts/config/webpack.config');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = [
	{
		...scriptsConfig,
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
