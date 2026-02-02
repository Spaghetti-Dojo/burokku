/**
 * WordPress Webpack Config Extension
 *
 * This extends the default @wordpress/scripts webpack configuration
 * to support the monorepo structure under /sources/.
 */

const path = require( 'path' );
const fs = require( 'fs' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * @typedef {Object.<string, string>} Entries
 */

/**
 * Automatically discover block entry points from /sources/Blocks/
 * Each block directory with an edit.ts or view.ts gets an entry point
 *
 * @return {Entries} Object mapping entry names to file paths
 */
function blockEntries() {
	/** @type {Entries} */
	const entries = {};
	const blocksDir = path.resolve( __dirname, 'sources/Blocks' );

	// Check if Blocks directory exists
	if ( ! fs.existsSync( blocksDir ) ) {
		return entries;
	}

	// Read all block directories
	const blockDirs = fs
		.readdirSync( blocksDir, { withFileTypes: true } )
		.filter( ( dirent ) => dirent.isDirectory() )
		.map( ( dirent ) => dirent.name );

	blockDirs.forEach( ( blockName ) => {
		const blockDir = path.join( blocksDir, blockName );

		// Look for edit.ts/tsx or view.ts/tsx as entry points
		const possibleEntries = [
			'edit.ts',
			'edit.tsx',
			'view.ts',
			'view.tsx',
		];

		possibleEntries.forEach( ( entryFile ) => {
			const entryPath = path.join( blockDir, entryFile );
			if ( fs.existsSync( entryPath ) ) {
				const fileBase = entryFile.replace( /\.(ts|tsx)$/, '' );
				const entryName = `@burokku/${ blockName }-${ fileBase }`;
				entries[ entryName ] = entryPath;
			}
		} );
	} );

	return entries;
}

// Get custom entries
const customEntries = blockEntries();

// Export config with custom entries and output path
module.exports = {
	...defaultConfig,
	entry: customEntries,
	output: {
		...( defaultConfig.output || {} ),
		path: path.resolve( __dirname, 'dist' ),
	},
};
