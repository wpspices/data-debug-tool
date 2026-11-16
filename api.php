<?php
/**
 * API handling class for Data Debug Tool plugin
 *
 * @package data-debug-tool
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class DATA_DEBUG_TOOL_API
 * Handles all REST API functionality for the Data Debug Tool plugin
 *
 * @since 0.1.0
 */
class DATA_DEBUG_TOOL_API {

	/**
	 * API namespace
	 *
	 * @var string
	 */
	private $namespace = 'data-debug-tool/v1';

	/**
	 * Helper class
	 *
	 * @var object
	 */
	private $helper;

	/**
	 * Initialize the API
	 *
	 * @return void
	 */
	public function init() {
		$this->helper = new DATA_DEBUG_TOOL_HELPER();
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Get API arguments
	 *
	 * @param array $args Endpoint arguments.
	 * @return array
	 */
	private function get_api_args( $args = array() ) {
		return array_merge(
			array(
				'show_in_index'       => false,
				'methods'             => array( WP_REST_Server::READABLE, WP_REST_Server::CREATABLE ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			),
			$args
		);
	}

	/**
	 * Return rest response
	 *
	 * @param mixed   $res Response data to send.
	 * @param integer $code Response HTTP status code (defaults to 200).
	 *
	 * @return WP_REST_Response REST response.
	 */
	public function response( $res, $code = 200 ) {
		return new WP_REST_Response(
			array(
				'data'    => $res,
				'success' => 200 === $code,
			),
			$code
		);
	}

	/**
	 * Sanitize parameters
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return array sanitized parameters
	 */
	public function sanitize_params( $request ) {
		return $this->helper->sanitize_data( $request->get_params() );
	}

	/**
	 * Check admin permission
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return bool|WP_Error
	 */
	public function check_admin_permission( $request ) {
		if ( ! function_exists( 'current_user_can' ) || ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to access this resource.', 'data-debug-tool' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$params = $this->sanitize_params( $request );
		$nonce  = ! empty( $params['debug_nonce'] ) ? $params['debug_nonce'] : $request->get_header( 'x_wp_nonce' );

		if ( ! empty( $nonce ) && ( wp_verify_nonce( $nonce, 'wp_debug_rest' ) || wp_verify_nonce( $nonce, 'wp_rest' ) ) ) {
			return true;
		}

		if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {
			return true;
		}

		return new WP_Error(
			'rest_cookie_invalid_nonce',
			__( 'Cookie check failed or invalid security nonce.', 'data-debug-tool' ),
			array( 'status' => 403 )
		);
	}

	/**
	 * Register REST API routes
	 *
	 * @return void
	 */
	public function register_routes() {
		if ( ! function_exists( 'register_rest_route' ) ) {
			return;
		}

		/**
		 * Option
		 *
		 * args
		 * search: string
		 */
		register_rest_route(
			$this->namespace,
			'/option',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_option' ),
					'args'     => array(
						'search' => array(
							'required' => true,
							'type'     => 'string',
						),
					),
				),
			)
		);

		/**
		 * System Information
		 */
		register_rest_route(
			$this->namespace,
			'/system-info',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_system_info' ),
				)
			)
		);

		/**
		 * Active Plugins
		 */
		register_rest_route(
			$this->namespace,
			'/plugins',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_plugins_info' ),
				)
			)
		);

		/**
		 * Active Themes
		 */
		register_rest_route(
			$this->namespace,
			'/themes',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_themes_info' ),
				)
			)
		);

		/**
		 * Get post data
		 *
		 * args
		 * is_decode: boolean
		 * id: integer
		 */
		register_rest_route(
			$this->namespace,
			'/post',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_post_data' ),
					'args'     => array(
						'is_decode' => array(
							'type' => 'boolean',
						),
						'id'        => array(
							'required' => true,
							'type'     => 'integer',
						),
					),
				),
			)
		);

		/**
		 * Get post meta data
		 *
		 * args
		 * is_decode: boolean
		 * id: integer
		 * key: string
		 */
		register_rest_route(
			$this->namespace,
			'/postmeta',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_post_meta_data' ),
					'args'     => array(
						'is_decode' => array(
							'type' => 'boolean',
						),
						'id'        => array(
							'required' => true,
							'type'     => 'integer',
						),
						'key'       => array(
							'type' => 'string',
						),
					),
				)
			)
		);

		/**
		 * Get user data
		 *
		 * args
		 * is_decode: boolean
		 * id: integer
		 */
		register_rest_route(
			$this->namespace,
			'/user',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_user_data' ),
					'args'     => array(
						'is_decode' => array(
							'type' => 'boolean',
						),
						'id'        => array(
							'required' => true,
							'type'     => 'integer',
						),
					),
				)
			)
		);

		/**
		 * Get user meta data
		 *
		 * args
		 * is_decode: boolean
		 * id: integer
		 */
		register_rest_route(
			$this->namespace,
			'/usermeta',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_user_meta_data' ),
					'args'     => array(
						'is_decode' => array(
							'type' => 'boolean',
						),
						'id'        => array(
							'required' => true,
							'type'     => 'integer',
						),
						'key'       => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				)
			)
		);

		/**
		 * Get term data
		 *
		 * args
		 * is_decode: boolean
		 * taxonomy: string
		 * id: integer
		 */
		register_rest_route(
			$this->namespace,
			'/term',
			$this->get_api_args(
				array(
					'callback' => array( $this, 'get_term_data' ),
					'args'     => array(
						'is_decode' => array(
							'type' => 'boolean',
						),
						'taxonomy'  => array(
							'type' => 'string',
						),
						'id'        => array(
							'required' => true,
							'type'     => 'integer',
						),
					),
				)
			)
		);
	}

	/**
	 * Get WordPress option by name with suggestions if not found
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_option( $request ) {
		global $wpdb;
		// get parameters from request
		$params      = $this->sanitize_params( $request );
		$option_name = sanitize_text_field( $params['search'] );

		if ( empty( $option_name ) ) {
			return $this->response( array( 'message' => __( 'Option name is required.', 'data-debug-tool' ) ), 400 );
		}

		$option_value = get_option( $option_name, null );

		if ( null === $option_value ) {
			$option_value = array(
				'message' => __( 'Option not found.', 'data-debug-tool' ),
			);
			return $this->response( $option_value, 404 );
		} else {
			$option_value = array(
				'name'  => $option_name,
				'value' => $this->helper->decode_data( $option_value, $params ),
			);
		}

		return $this->response( $option_value );
	}

	/**
	 * Get system information
	 *
	 * @return WP_REST_Response
	 */
	public function get_system_info() {
		global $wpdb;

		return $this->response(
			array(
				'wordpress' => array(
					'version'      => get_bloginfo( 'version' ),
					'multisite'    => is_multisite(),
					'permalink'    => get_option( 'permalink_structure' ),
					'debug_mode'   => ( defined( 'WP_DEBUG' ) && WP_DEBUG ),
					'memory_limit' => defined( 'WP_MEMORY_LIMIT' ) ? WP_MEMORY_LIMIT : '',
				),
				'server'    => array(
					'php_version'     => defined( 'PHP_VERSION' ) ? PHP_VERSION : '',
					'mysql_version'   => $wpdb->db_version(),
					'server_software' => empty( $_SERVER['SERVER_SOFTWARE'] ) ? '' : sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ),
					'max_upload'      => size_format( wp_max_upload_size() ),
					'php_memory'      => $this->helper->sanitize_data( ini_get( 'memory_limit' ) ),
					'php_time_limit'  => $this->helper->sanitize_data( ini_get( 'max_execution_time' ) ),
				),
				'database'  => array(
					'name'         => defined( 'DB_NAME' ) ? DB_NAME : '',
					'host'         => defined( 'DB_HOST' ) ? DB_HOST : '',
					'charset'      => defined( 'DB_CHARSET' ) ? DB_CHARSET : '',
					'collate'      => defined( 'DB_COLLATE' ) ? DB_COLLATE : '',
					'table_prefix' => $wpdb->prefix,
				),
			)
		);
	}

	/**
	 * Get plugins information
	 *
	 * @return WP_REST_Response
	 */
	public function get_plugins_info() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$all_plugins    = get_plugins();
		$active_plugins = get_option( 'active_plugins', array() );

		$plugins = array();
		foreach ( $all_plugins as $plugin_path => $plugin_data ) {
			$plugins[] = array(
				'name'        => $plugin_data['Name'],
				'version'     => $plugin_data['Version'],
				'author'      => $plugin_data['Author'],
				'description' => $plugin_data['Description'],
				'is_active'   => in_array( $plugin_path, $active_plugins, true ),
				'path'        => $plugin_path,
			);
		}

		return $this->response( $plugins );
	}

	/**
	 * Get themes information
	 *
	 * @return WP_REST_Response
	 */
	public function get_themes_info() {
		$themes        = wp_get_themes();
		$current_theme = wp_get_theme();
		$theme_data    = array();

		foreach ( $themes as $theme_dir => $theme ) {
			$theme_data[] = array(
				'name'       => $theme->get( 'Name' ),
				'version'    => $theme->get( 'Version' ),
				'author'     => $theme->get( 'Author' ),
				'template'   => $theme->get( 'Template' ),
				'stylesheet' => $theme->get_stylesheet(),
				'is_current' => ( $theme_dir === $current_theme->get_stylesheet() ),
			);
		}

		return $this->response( $theme_data );
	}

	/**
	 * Get post data by ID
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_post_data( $request ) {
		// get parameters from request
		$params = $this->sanitize_params( $request );

		if ( $this->helper->is_invalid_for_id( $params, 'id' ) ) {
			return $this->response( array( 'message' => __( 'Missing or Invalid Post ID.', 'data-debug-tool' ) ), 400 );
		}

		$post = get_post( absint( $params['id'] ) );

		if ( empty( $post ) ) {
			return $this->response( array( 'message' => __( 'Post not found.', 'data-debug-tool' ) ), 404 );
		}

		$meta = get_post_meta( $post->ID );
		if ( ! empty( $meta ) ) {
			foreach ( $meta as $key => $value ) {
				$meta[ $key ] = $this->helper->decode_data( $value[0], $params );
			}
		}

		return $this->response(
			array(
				'post'         => $post,
				'post_content' => $this->helper->decode_data( $post->post_content, $params ),
				'meta'         => $meta,
			),
			200
		);
	}

	/**
	 * Get post meta data
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_post_meta_data( $request ) {
		// get parameters from request
		$params = $this->sanitize_params( $request );
		if ( $this->helper->is_invalid_for_id( $params, 'id' ) ) {
			return $this->response( array( 'message' => __( 'Missing or Invalid Post ID.', 'data-debug-tool' ) ), 400 );
		}

		$id       = absint( $params['id'] );
		$meta_key = isset( $params['key'] ) ? $params['key'] : '';

		if ( ! empty( $meta_key ) ) {
			$meta = get_post_meta( $id, $meta_key, true );
		} else {
			$meta = get_post_meta( $id );
		}

		if ( empty( $meta ) ) {
			return $this->response( array( 'message' => __( 'Post meta not found.', 'data-debug-tool' ) ), 404 );
		}

		$meta_data = array();

		if ( ! empty( $meta_key ) ) {
			$meta_data[ $meta_key ] = $this->helper->decode_data( $meta, $params );
		} else {
			foreach ( $meta as $key => $value ) {
				$meta_data[ $key ] = $this->helper->decode_data( $value[0], $params );
			}
		}

		return $this->response(
			array(
				'meta' => $meta_data,
				'id'   => $id,
			),
			200
		);
	}

	/**
	 * Get user data
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_user_data( $request ) {
		// get parameters from request
		$params = $this->sanitize_params( $request );
		if ( $this->helper->is_invalid_for_id( $params, 'id' ) ) {
			return $this->response( array( 'message' => __( 'Missing or Invalid User ID.', 'data-debug-tool' ) ), 400 );
		}

		$user = get_user_by( 'id', absint( $params['id'] ) );

		if ( ! $user ) {
			return $this->response( array( 'message' => __( 'User not found.', 'data-debug-tool' ) ), 404 );
		}

		$user_data = clone $user->data;
		unset( $user_data->user_pass, $user_data->user_activation_key );

		return $this->response(
			array(
				'user'         => $user_data,
				'roles'        => $user->roles,
				'capabilities' => $user->allcaps,
			)
		);
	}

	/**
	 * Get user meta data
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_user_meta_data( $request ) {
		// get parameters from request
		$params = $this->sanitize_params( $request );
		if ( $this->helper->is_invalid_for_id( $params, 'id' ) ) {
			return $this->response( array( 'message' => __( 'Missing or Invalid User ID.', 'data-debug-tool' ) ), 400 );
		}
		$id       = absint( $params['id'] );
		$meta_key = isset( $params['key'] ) ? $params['key'] : '';

		if ( ! empty( $meta_key ) ) {
			$meta = get_user_meta( $id, $meta_key, true );
		} else {
			$meta = get_user_meta( $id );
		}

		if ( empty( $meta ) ) {
			return $this->response( array( 'message' => __( 'user meta not found.', 'data-debug-tool' ) ), 404 );
		}

		$meta_data = array();

		if ( ! empty( $meta_key ) ) {
			$meta_data[ $meta_key ] = $this->helper->decode_data( $meta, $params );
		} else {
			foreach ( $meta as $key => $value ) {
				if ( 'session_tokens' === $key ) {
					$meta_data[ $key ] = __( '[Hidden for security]', 'data-debug-tool' );
					continue;
				}
				$meta_data[ $key ] = $this->helper->decode_data( $value[0], $params );
			}
		}

		return $this->response(
			array(
				'meta' => $meta_data,
				'id'   => $id,
			),
			200
		);
	}

	/**
	 * Get term data
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_term_data( $request ) {
		// get parameters from request
		$params = $this->sanitize_params( $request );
		if ( $this->helper->is_invalid_for_id( $params, 'id' ) ) {
			return $this->response( array( 'message' => __( 'Missing or Invalid Term ID.', 'data-debug-tool' ) ), 400 );
		}

		$params['id'] = absint( $params['id'] );

		$term = get_term( $params['id'], empty( $params['taxonomy'] ) ? '' : $params['taxonomy'] );

		if ( is_wp_error( $term ) || empty( $term ) ) {
			return $this->response( array( 'message' => __( 'Term not found.', 'data-debug-tool' ) ), 404 );
		}

		return $this->response(
			array(
				'term'     => $term,
				'taxonomy' => get_taxonomy( $term->taxonomy ),
			)
		);
	}
}
