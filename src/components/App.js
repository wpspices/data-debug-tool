// src/components/App.js
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Button, Icon, Notice } from '@wordpress/components';
import FiltersPanel from './FiltersPanel';
import JsonViewer from './JsonViewer';

const App = () => {
	const [ darkMode, setDarkMode ] = useState( false );
	const [ data, setData ] = useState( null );
	const [ totalPages, setTotalPages ] = useState( 0 );
	const [ isFullscreen, setIsFullscreen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState( null );

	const fetchData = async ( { endpoint, params } ) => {
		setIsLoading( true );
		setErrorMessage( null );
		try {
			const response = await apiFetch( {
				path: `/data-debug-tool/v1/${ endpoint }`,
				method: 'POST',
				data: params,
			} );

			if ( response && undefined !== response.data ) {
				setData( response.data );
				if ( response.data && response.data.pages ) {
					setTotalPages( response.data.pages );
				}
			} else {
				setErrorMessage(
					( response && response.message ) ||
						__( 'Unknown error occurred.', 'data-debug-tool' )
				);
				setData( null );
				setTotalPages( 0 );
			}
		} catch ( error ) {
			setErrorMessage(
				( error && error.message ) ||
					__( 'Error fetching data from server.', 'data-debug-tool' )
			);
			setData( null );
			setTotalPages( 0 );
		}
		setIsLoading( false );
	};

	const toggleFullscreen = () => {
		const elem = document.documentElement;

		if ( ! document.fullscreenElement ) {
			if ( elem.requestFullscreen ) {
				elem.requestFullscreen();
			}
			setIsFullscreen( true );
			document.body.classList.add( 'fullscreen-mode' );
		} else {
			if ( document.exitFullscreen ) {
				document.exitFullscreen();
			}
			setIsFullscreen( false );
			document.body.classList.remove( 'fullscreen-mode' );
		}
	};

	useEffect( () => {
		const handleFullscreenChange = () => {
			if ( ! document.fullscreenElement ) {
				setIsFullscreen( false );
				document.body.classList.remove( 'fullscreen-mode' );
			}
		};

		document.addEventListener( 'fullscreenchange', handleFullscreenChange );

		return () => {
			document.removeEventListener(
				'fullscreenchange',
				handleFullscreenChange
			);
		};
	}, [] );

	const handleFilter = ( filters ) => {
		fetchData( filters );
	};

	const appTitle =
		window.dataDebugTool && window.dataDebugTool.title
			? window.dataDebugTool.title
			: __( 'Data Debug Tool', 'data-debug-tool' );

	return (
		<div
			className={ `debug-tool-wrapper ${ darkMode ? 'dark-mode' : '' }` }
		>
			<header className="debug-tool-header">
				<div className="header-title">
					<Icon icon="admin-tools" size={ 30 } />
					<h1>{ appTitle }</h1>
				</div>
				<div className="header-controls">
					<Button
						icon="star-half"
						className="icon-button"
						onClick={ () => setDarkMode( ! darkMode ) }
						label={ __( 'Toggle Dark Mode', 'data-debug-tool' ) }
						isPressed={ darkMode }
					/>
					<Button
						icon={
							isFullscreen
								? 'fullscreen-exit-alt'
								: 'fullscreen-alt'
						}
						className="icon-button"
						onClick={ toggleFullscreen }
						label={ __( 'Toggle Fullscreen', 'data-debug-tool' ) }
						isPressed={ isFullscreen }
					/>
				</div>
			</header>
			<div className="debug-tool-content">
				<aside className="filters-panel">
					<FiltersPanel
						onFilter={ handleFilter }
						totalPages={ totalPages }
					/>
				</aside>
				<main className="output-panel">
					{ errorMessage && (
						<Notice
							status="error"
							isDismissible={ false }
							className="debug-tool-error-notice"
						>
							{ errorMessage }
						</Notice>
					) }
					{ isLoading ? (
						<div className="loading-spinner"></div>
					) : (
						<JsonViewer data={ data } />
					) }
				</main>
			</div>
		</div>
	);
};

export default App;
