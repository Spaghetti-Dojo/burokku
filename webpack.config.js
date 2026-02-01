/**
 * WordPress Webpack Config Extension
 *
 * This extends the default @wordpress/scripts webpack configuration
 * to support the monorepo structure under /sources/.
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const fs = require( 'fs' );

/**
 * Automatically discover block entry points from /sources/Blocks/
 * Each block directory with an index.js or edit.js gets an entry point
 */
function getBlockEntries() {
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

		// Look for index.js, edit.js, or view.js as entry points
		const possibleEntries = [ 'index.js', 'edit.js', 'view.js' ];

		possibleEntries.forEach( ( entryFile ) => {
			const entryPath = path.join( blockDir, entryFile );
			if ( fs.existsSync( entryPath ) ) {
				const entryName = `blocks/${ blockName }/${ entryFile.replace(
					'.js',
					''
				) }`;
				entries[ entryName ] = entryPath;
			}
		} );
	} );

	return entries;
}

/**
 * Get entries for other source directories (Animations, Integrations, etc.)
 */
function getSourceEntries() {
	const entries = {};
	const sourcesDir = path.resolve( __dirname, 'sources' );

	if ( ! fs.existsSync( sourcesDir ) ) {
		return entries;
	}

	// Define directories to scan for index.js files
	const sourceDirs = [ 'Animations', 'Integrations', 'Utils' ];

	sourceDirs.forEach( ( dirName ) => {
		const dirPath = path.join( sourcesDir, dirName );
		if ( ! fs.existsSync( dirPath ) ) {
			return;
		}

		// Look for index.js in the directory
		const indexPath = path.join( dirPath, 'index.js' );
		if ( fs.existsSync( indexPath ) ) {
			entries[ dirName.toLowerCase() ] = indexPath;
		}
	} );

	return entries;
}

// Merge all entries
const customEntries = {
	...getBlockEntries(),
	...getSourceEntries(),
};

// If there are no custom entries, use the default config as-is
if ( Object.keys( customEntries ).length === 0 ) {
	module.exports = defaultConfig;
} else {
	// Extend the default config with custom entries
	module.exports = {
		...defaultConfig,
		entry: {
			...( defaultConfig.entry || {} ),
			...customEntries,
		},
		output: {
			...( defaultConfig.output || {} ),
			path: path.resolve( __dirname, 'assets' ),
		},
	};
}
