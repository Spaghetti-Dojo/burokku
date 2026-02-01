/**
 * Test Block - Editor and Frontend
 *
 * This is a simple test block to verify the build system is working.
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// Import block styles
import './style.scss';

/**
 * Edit component for the test block
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {Element} Element to render
 */
function Edit( { attributes } ) {
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
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {Element} Element to render
 */
function Save( { attributes } ) {
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
registerBlockType( 'burokku/test-block', {
	edit: Edit,
	save: Save,
} );
