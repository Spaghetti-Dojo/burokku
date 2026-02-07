/**
 * WordPress Webpack Config Extension
 *
 * Extends the default @wordpress/scripts webpack configuration
 * to support the monorepo structure under /sources/.
 */

const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/** @type {import('webpack').Configuration} */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

function stylesEntries() {
	const entries = {};
	const stylesPath = path.resolve(__dirname, 'sources/client/styles');

	function scanDirectory(dir, prefix = '') {
		const items = fs.readdirSync(dir, { withFileTypes: true });

		items.forEach((item) => {
			if (!item.isDirectory() || item.name.includes('mixins')) {
				return;
			}

			const fullPath = path.join(dir, item.name);
			const indexScss = path.join(fullPath, 'index.scss');

			if (fs.existsSync(indexScss)) {
				const entryKey = prefix ? `${prefix}/${item.name}` : item.name;
				entries[entryKey] = indexScss;
				return; // Do not descend when this directory already provides an entry
			}

			const newPrefix = prefix ? `${prefix}/${item.name}` : `@${item.name}`;
			scanDirectory(fullPath, newPrefix);
		});
	}

	scanDirectory(stylesPath);
	return entries;
}

// Export config with custom entries and output path
/** @type {import('webpack').Configuration} */
const styles = {
	...defaultConfig,
	entry: stylesEntries(),
	resolve: {
		...(defaultConfig.resolve || {}),
		alias: {
			'@burokku/mixins': path.resolve(__dirname, 'sources/client/styles/mixins'),
		},
	},
	output: {
		...(defaultConfig.output || {}),
		path: path.resolve(__dirname, 'dist/styles'),
		clean: true
	},
	plugins: [
		...(defaultConfig.plugins || []).filter(plugin => plugin.constructor.name !== 'RtlCssPlugin'),
		new CleanWebpackPlugin({
			cleanAfterEveryBuildPatterns: [
				'**/*.js',
				'**/*.js.map',
				'**/*.css.map'
			],
			protectWebpackAssets: false
		})
	]
};

module.exports = styles;
