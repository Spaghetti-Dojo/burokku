/**
 * Test Block - Editor Component
 *
 * This is a simple test block to verify the build system is working.
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';

// Import block styles
import './style.scss';

interface BlockAttributes {
	content: string;
}

/**
 * Edit component for the test block
 *
 * @param {Object} root0            - Component props
 * @param {Object} root0.attributes - Block attributes
 * @return {JSX.Element} Block edit component
 */
function Edit( {
	attributes,
}: BlockEditProps< BlockAttributes > ): JSX.Element {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<p>{ attributes.content }</p>
			<p style={ { fontSize: '0.875rem', color: '#666' } }>
				{ __( 'Build system is working!', 'burokku' ) }
			</p>
		</div>
	);
}

/**
 * Save component for the test block
 *
 * @param {Object} root0            - Component props
 * @param {Object} root0.attributes - Block attributes
 * @return {JSX.Element} Block save component
 */
function Save( {
	attributes,
}: BlockEditProps< BlockAttributes > ): JSX.Element {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<p>{ attributes.content }</p>
		</div>
	);
}

/**
 * Register the test block
 */
registerBlockType< BlockAttributes >( 'burokku/test-block', {
	edit: Edit,
	save: Save,
} );
