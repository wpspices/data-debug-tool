import { useState, useEffect } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	Button,
	ToggleControl,
	Panel,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const FiltersPanel = ( { onFilter, totalPages = 0 } ) => {
	const [ selectedFilter, setSelectedFilter ] = useState( '' );
	const [ params, setParams ] = useState( {} );
	const [ isDecode, setIsDecode ] = useState( false );
	const [ isExactMatch, setIsExactMatch ] = useState( true );
	const [ tables, setTables ] = useState( [] );
	const [ columns, setColumns ] = useState( [] );
	const [ loading, setLoading ] = useState( false );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ localTotalPages, setLocalTotalPages ] = useState( 0 );
	
	useEffect( () => {
		setLocalTotalPages( totalPages );
	}, [ totalPages ] );


	useEffect( () => {
		// Reset pagination when filter changes
		setCurrentPage( 1 );
		setLocalTotalPages( 0 );
	}, [ selectedFilter, params.table, params.column, params.search ] );

	const handlePageChange = ( newPage ) => {
		setCurrentPage( newPage );
		handleSubmit( newPage );
	};

	/**
	 * Get param fields
	 *
	 */
	const getParamFields = () => {
		switch ( selectedFilter ) {
			case 'option':
				return (
					<TextControl
						label={ __( 'Option Name', 'data-debug-tool' ) + '*' }
						value={ params.search || '' }
						onChange={ ( search ) =>
							setParams( { ...params, search } )
						}
						required
					/>
				);
			case 'post':
			case 'postmeta':
			case 'user':
			case 'usermeta':
			case 'term':
				return (
					<>
						<TextControl
							label={ __( 'ID', 'data-debug-tool' ) + '*' }
							type="number"
							min={1}
							value={ params.id || '' }
							onChange={ ( id ) =>
								setParams( { ...params, id: parseInt( id ) } )
							}
							required
						/>
						{ [ 'postmeta', 'usermeta' ].includes(
							selectedFilter
						) && (
							<TextControl
								label={ __( 'Key', 'data-debug-tool' ) }
								value={ params.key || '' }
								onChange={ ( key ) =>
									setParams( { ...params, key } )
								}
							/>
						) }
					</>
				);
			default:
				return null;
		}
	};

	const isValid = () => {
		console.log( ' params ', params );
		switch ( selectedFilter ) {
			case 'option':
				return !! params.search;
			case 'post':
			case 'postmeta':
			case 'user':
			case 'usermeta':
			case 'term':
				return !! params.id;
			case 'plugins':
			case 'themes':
			case 'system-info':
				return true;
			default:
				return false;
		}
	};

	const handleSubmit = ( page = 1 ) => {
		if ( ! selectedFilter || ! isValid() ) return;

		onFilter( {
			endpoint: selectedFilter,
			params: {
				...params,
				is_decode: isDecode ? 1 : 0,
				debug_nonce: window.dataDebugTool.nonce,
				page: page,
				search_type: isExactMatch ? 'exact' : 'like',
			},
		} );
	};

	const renderPagination = () => {
		if ( localTotalPages <= 1 ) return null;

		return (
			<div className="pagination-wrapper">
				<Button
					variant="secondary"
					onClick={ () => handlePageChange( 1 ) }
					disabled={ currentPage === 1 }
				>
					{ '<<' }
				</Button>
				<Button
					variant="secondary"
					onClick={ () => handlePageChange( currentPage - 1 ) }
					disabled={ currentPage === 1 }
				>
					{ '<' }
				</Button>
				<span className="page-info">
					{ __( 'Page', 'data-debug-tool' ) } { currentPage }{ ' ' }
					{ __( 'of', 'data-debug-tool' ) } { localTotalPages }
				</span>
				<Button
					variant="secondary"
					onClick={ () => handlePageChange( currentPage + 1 ) }
					disabled={ currentPage === localTotalPages }
				>
					{ '>' }
				</Button>
				<Button
					variant="secondary"
					onClick={ () => handlePageChange( localTotalPages ) }
					disabled={ currentPage === localTotalPages }
				>
					{ '>>' }
				</Button>
			</div>
		);
	};

	// Convert filters object to SelectControl options
	const filterOptions = Object.entries( window.dataDebugTool.filters ).map(
		( [ value, label ] ) => ( {
			value,
			label,
		} )
	);

	return (
		<div className="filters-container">
			<SelectControl
				label={ __( 'Debug Action', 'data-debug-tool' ) }
				value={ selectedFilter }
				options={ [
					{
						value: '',
						label: __( 'Select an action...', 'data-debug-tool' ),
					},
					...filterOptions,
				] }
				onChange={ ( value ) => {
					setSelectedFilter( value );
					setParams( {} ); // Reset params when filter changes
				} }
			/>
			{ getParamFields() }
			<ToggleControl
				label={ __( 'Decode Data', 'data-debug-tool' ) }
				checked={ isDecode }
				onChange={ setIsDecode }
				help={ __(
					'Automatically decode and format JSON data, unserialize PHP serialized data, and parse Gutenberg blocks for better readability',
					'data-debug-tool'
				) }
			/>
			{ renderPagination() }
			<Button
				icon="search"
				variant="secondary"
				onClick={ () => handleSubmit( 1 ) }
				disabled={ ! selectedFilter || ! isValid() }
			>
				{ __( 'Search', 'data-debug-tool' ) }
			</Button>
		</div>
	);
};

export default FiltersPanel;
