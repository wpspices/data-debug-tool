import { useState } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const JsonViewer = ( { data } ) => {
	if ( ! data ) return null;
	const [ copyText, setCopyText ] = useState( __( 'Copy', 'data-debug-tool' ) );

	const escapeHtml = ( str ) => {
		return str
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#039;' );
	};

	const handleCopy = () => {
		const plainText = JSON.stringify( data, null, 2 );
		navigator.clipboard.writeText( plainText );
		setCopyText( __( 'Copied!', 'data-debug-tool' ) );
		setTimeout( () => {
			setCopyText( __( 'Copy', 'data-debug-tool' ) );
		}, 2000 );
	};

	const formatJSON = ( obj ) => {
		if ( ! obj ) return '';

		const formatValue = ( value, indent = '' ) => {
			if ( value === null ) return '<span class="json-null">null</span>';
			if ( typeof value === 'boolean' )
				return `<span class="json-boolean">${ value }</span>`;
			if ( typeof value === 'number' )
				return `<span class="json-number">${ value }</span>`;
			if ( typeof value === 'string' ) {
				const escaped = escapeHtml( value );
				return `<span class="json-string">"<span class="json-string-value">${ escaped }</span>"</span>`;
			}
			if ( Array.isArray( value ) ) {
				if ( value.length === 0 )
					return '<span class="json-bracket">[]</span>';
				const items = value
					.map(
						( item ) =>
							`${ indent }  ${ formatValue(
								item,
								indent + '  '
							) }`
					)
					.join( '<span class="json-comma">,</span>\n' );
				return `<span class="json-bracket">[</span>\n${ items }\n${ indent }<span class="json-bracket">]</span>`;
			}
			if ( typeof value === 'object' ) {
				const entries = Object.entries( value );
				if ( entries.length === 0 )
					return '<span class="json-bracket">{}</span>';
				const items = entries
					.map(
						( [ key, val ] ) =>
							`${ indent }  <span class="json-key">"${ escapeHtml(
								key
							) }"</span>: ${ formatValue( val, indent + '  ' ) }`
					)
					.join( '<span class="json-comma">,</span>\n' );
				return `<span class="json-bracket">{</span>\n${ items }\n${ indent }<span class="json-bracket">}</span>`;
			}
			return String( value );
		};

		return formatValue( obj );
	};

	return (
		<div className="json-viewer-container">
			<div className="json-viewer-header">
				<Button
					icon="admin-page"
					onClick={ handleCopy }
					className="json-copy-button"
					label={ __( 'Copy to clipboard', 'data-debug-tool' ) }
				>
					{ copyText }
				</Button>
			</div>
			<div
				className="json-viewer"
				dangerouslySetInnerHTML={ {
					__html: formatJSON( data ),
				} }
			/>
		</div>
	);
};

export default JsonViewer;
