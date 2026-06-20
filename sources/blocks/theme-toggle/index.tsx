import { registerBlockType } from '@wordpress/blocks';
//@ts-expect-error
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';
import './style.scss';

registerBlockType( metadata.name, {
	attributes: {},
	category: metadata.category,
	title: metadata.title,
	edit: () => <ServerSideRender block={ metadata.name } />,
	save: () => null,
} );
