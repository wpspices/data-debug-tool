// src/components/App.js
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Button, Icon } from '@wordpress/components';
import FiltersPanel from './FiltersPanel';
import JsonViewer from './JsonViewer';

const App = () => {
	const [ darkMode, setDarkMode ] = useState( false );
	const [ data, setData ] = useState( null );
	const [ totalPages, setTotalPages ] = useState( 0 );
	const [ isFullscreen, setIsFullscreen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );

	const fetchData = async ( { endpoint, params } ) => {
		setIsLoading( true );
		try {
			const response = await apiFetch( {
				path: `/data-debug-tool/v1/${ endpoint }`,
				method: 'POST',
				data: params,
			} );

			if (
				( undefined !== response && undefined !== response.data ) ||
				null !== response.data
			) {
				setData( response.data );
				// Update total pages if pagination info is available
				if ( response.data.pages ) {
					setTotalPages( response.data.pages );
				}
			} else {
				console.error(
					'API Error:',
					response.message || 'Unknown error occurred'
				);
				setData( null );
				setTotalPages( 0 );
			}
		} catch ( error ) {
			console.error( 'Error fetching data:', error );
			setData( null );
			setTotalPages( 0 );
		}
		setIsLoading( false );
	};

	const toggleFullscreen = () => {
		const elem = document.documentElement;

		if (
			! document.fullscreenElement &&
			! document.webkitFullscreenElement
		) {
			if ( elem.requestFullscreen ) {
				elem.requestFullscreen();
			} else if ( elem.webkitRequestFullscreen ) {
				elem.webkitRequestFullscreen();
			}
			setIsFullscreen( true );
			document.body.classList.add( 'fullscreen-mode' );
		} else {
			if ( document.exitFullscreen ) {
				document.exitFullscreen();
			} else if ( document.webkitExitFullscreen ) {
				document.webkitExitFullscreen();
			}
			setIsFullscreen( false );
			document.body.classList.remove( 'fullscreen-mode' );
		}
	};

	useEffect( () => {
		const handleFullscreenChange = () => {
			if (
				! document.fullscreenElement &&
				! document.webkitFullscreenElement
			) {
				setIsFullscreen( false );
				document.body.classList.remove( 'fullscreen-mode' );
			}
		};

		document.addEventListener( 'fullscreenchange', handleFullscreenChange );
		document.addEventListener(
			'webkitfullscreenchange',
			handleFullscreenChange
		);

		return () => {
			document.removeEventListener(
				'fullscreenchange',
				handleFullscreenChange
			);
			document.removeEventListener(
				'webkitfullscreenchange',
				handleFullscreenChange
			);
		};
	}, [] );

	const handleFilter = ( filters ) => {
		fetchData( filters );
	};

	return (
		<div
			className={ `debug-tool-wrapper ${ darkMode ? 'dark-mode' : '' }` }
		>
			<header className="debug-tool-header">
				<div className="header-title">
					<Icon icon="admin-tools" size={ 30 } />
					<h1>{ window.dataDebugTool.title }</h1>
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
