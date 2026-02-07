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
			if (item.isDirectory()) {
				const fullPath = path.join(dir, item.name);
				const newPrefix = prefix ? `${prefix}/${item.name}` : `@${item.name}`;

				// Check for index.scss in this directory
				const indexScss = path.join(fullPath, 'index.scss');
				if (fs.existsSync(indexScss)) {
					entries[newPrefix] = indexScss;
				}

				// Recursively scan subdirectories
				scanDirectory(fullPath, newPrefix);
			}
		});
	}

	scanDirectory(stylesPath);
	return entries;
}

// Export config with custom entries and output path
/** @type {import('webpack').Configuration} */
const config = {
	...defaultConfig,
	entry: stylesEntries(),
	output: {
		...(defaultConfig.output || {}),
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	plugins: [
		...(defaultConfig.plugins || []),
		new CleanWebpackPlugin({
			cleanAfterEveryBuildPatterns: [
				'@block-styles/*.js',
				'@block-styles/*.js.map',
				'@block-styles/*.css.map'
			],
			protectWebpackAssets: false
		})
	]
};

module.exports = config;
