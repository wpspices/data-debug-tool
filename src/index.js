// src/index.js
import { createRoot } from '@wordpress/element';
import App from './components/App';
import './style.scss';

const root = createRoot( document.getElementById( 'data-debug-tool-root' ) );
root.render( <App /> );
