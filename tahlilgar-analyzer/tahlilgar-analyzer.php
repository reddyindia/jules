<?php
/**
 * Plugin Name: تحلیلگر
 * Plugin URI: https://example.com/
 * Description: A simple WordPress plugin.
 * Version: 1.0
 * Author: Your Name
 * Author URI: https://example.com/
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Create pages on plugin activation.
 */
function tahlilgar_analyzer_create_pages() {
    // Dashboard Page
    if ( ! get_page_by_path( 'dashboard' ) ) {
        $dashboard_page = array(
            'post_title'    => __( 'Dashboard', 'tahlilgar-analyzer' ),
            'post_name'     => 'dashboard',
            'post_content'  => '',
            'post_status'   => 'publish',
            'post_author'   => 1,
            'post_type'     => 'page',
            'page_template' => 'template-dashboard.php'
        );
        wp_insert_post( $dashboard_page );
    }

    // Login Page
    if ( ! get_page_by_path( 'login' ) ) {
        $login_page = array(
            'post_title'    => __( 'Login', 'tahlilgar-analyzer' ),
            'post_name'     => 'login',
            'post_content'  => '',
            'post_status'   => 'publish',
            'post_author'   => 1,
            'post_type'     => 'page',
            'page_template' => 'template-login.php'
        );
        wp_insert_post( $login_page );
    }

    // Form Builder Page
    if ( ! get_page_by_path( 'form-builder' ) ) {
        $form_builder_page = array(
            'post_title'    => __( 'Form Builder', 'tahlilgar-analyzer' ),
            'post_name'     => 'form-builder',
            'post_content'  => '',
            'post_status'   => 'publish',
            'post_author'   => 1,
            'post_type'     => 'page',
            'page_template' => 'template-form-builder.php'
        );
        wp_insert_post( $form_builder_page );
    }
}
register_activation_hook( __FILE__, 'tahlilgar_analyzer_create_pages' );

/**
 * Load page templates.
 *
 * @param string $template The path of the template to include.
 * @return string
 */
function tahlilgar_analyzer_load_template( $template ) {
    if ( is_page( 'dashboard' ) ) {
        $new_template = plugin_dir_path( __FILE__ ) . 'template-dashboard.php';
        if ( file_exists( $new_template ) ) {
            return $new_template;
        }
    }

    if ( is_page( 'login' ) ) {
        $new_template = plugin_dir_path( __FILE__ ) . 'template-login.php';
        if ( file_exists( $new_template ) ) {
            return $new_template;
        }
    }

    if ( is_page( 'form-builder' ) ) {
        $new_template = plugin_dir_path( __FILE__ ) . 'template-form-builder.php';
        if ( file_exists( $new_template ) ) {
            return $new_template;
        }
    }

    return $template;
}
add_filter( 'page_template', 'tahlilgar_analyzer_load_template' );

/**
 * Enqueue dashboard assets.
 */
function tahlilgar_analyzer_enqueue_assets() {
    // Dashboard assets
    if ( is_page( 'dashboard' ) || is_page('form-builder') ) {
        wp_enqueue_style(
            'tahlilgar-dashboard-style',
            plugin_dir_url( __FILE__ ) . 'assets/css/dashboard.css',
            array(),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/dashboard.css' )
        );

        wp_enqueue_script(
            'tahlilgar-dashboard-script',
            plugin_dir_url( __FILE__ ) . 'assets/js/dashboard.js',
            array( 'jquery' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/dashboard.js' ),
            true
        );
    }

    // Form builder assets
    if ( is_page( 'form-builder' ) ) {
        // formBuilder CSS from CDN
        wp_enqueue_style(
            'form-builder-style',
            'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.css'
        );

        // formBuilder JS from CDN
        wp_enqueue_script(
            'form-builder-script',
            'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.js',
            array( 'jquery', 'jquery-ui-core', 'jquery-ui-sortable' ),
            '3.21.0',
            true
        );

        // Custom fields script
        wp_enqueue_script(
            'tahlilgar-form-builder-custom-fields',
            plugin_dir_url( __FILE__ ) . 'assets/js/form-builder-custom-fields.js',
            array( 'form-builder-script' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/form-builder-custom-fields.js' ),
            true
        );

        // Local init script
        wp_enqueue_script(
            'tahlilgar-form-builder-init',
            plugin_dir_url( __FILE__ ) . 'assets/js/form-builder-init.js',
            array( 'form-builder-script', 'tahlilgar-form-builder-custom-fields' ), // Depends on custom fields
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/form-builder-init.js' ),
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'tahlilgar_analyzer_enqueue_assets' );

/**
 * Register a custom post type for forms.
 */
function tahlilgar_analyzer_register_form_cpt() {
    $args = array(
        'public'      => false, // Not publicly queryable
        'show_ui'     => true,  // Show in admin UI
        'label'       => __( 'Tahlilgar Forms', 'tahlilgar-analyzer' ),
        'labels'      => array(
            'name'          => __( 'Forms', 'tahlilgar-analyzer' ),
            'singular_name' => __( 'Form', 'tahlilgar-analyzer' ),
            'add_new_item'  => __( 'Add New Form', 'tahlilgar-analyzer' ),
        ),
        'supports'    => array( 'title' ),
        'menu_icon'   => 'dashicons-list-view',
    );
    register_post_type( 'tahlilgar_form', $args );
}
add_action( 'init', 'tahlilgar_analyzer_register_form_cpt' );


/**
 * Register custom REST API endpoint for saving forms.
 */
function tahlilgar_analyzer_register_rest_routes() {
    register_rest_route( 'tahlilgar/v1', '/forms', array(
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'tahlilgar_analyzer_save_form_rest_handler',
        'permission_callback' => function () {
            return current_user_can( 'publish_posts' );
        },
        'args' => array(
            'form_title' => array(
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'form_data' => array(
                'required' => true,
            ),
        ),
    ) );
}
add_action( 'rest_api_init', 'tahlilgar_analyzer_register_rest_routes' );

/**
 * REST API handler for saving the form.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function tahlilgar_analyzer_save_form_rest_handler( WP_REST_Request $request ) {
    $form_title = $request->get_param( 'form_title' );
    $form_data  = $request->get_param( 'form_data' ); // Data is already unslashed by REST API

    if ( empty( $form_data ) ) {
        return new WP_Error( 'no_data', 'No form data received.', array( 'status' => 400 ) );
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $form_title,
        'post_content' => wp_json_encode( $form_data, JSON_UNESCAPED_UNICODE ), // Store as proper JSON
        'post_status'  => 'publish',
        'post_type'    => 'tahlilgar_form',
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'save_error', $post_id->get_error_message(), array( 'status' => 500 ) );
    }

    $response = new WP_REST_Response( array( 'post_id' => $post_id, 'message' => 'Form saved successfully!' ), 201 );
    $response->header( 'Location', get_edit_post_link( $post_id, 'raw' ) );

    return $response;
}

// In the enqueue function, we need to localize the script to pass REST info
function tahlilgar_analyzer_localize_scripts( $handle ) {
    if ( $handle === 'tahlilgar-form-builder-init' ) {
        wp_localize_script(
            'tahlilgar-form-builder-init',
            'tahlilgar_form_builder',
            array(
                // get_rest_url provides the root, e.g., https://example.com/wp-json/
                'rest_url' => get_rest_url( null, 'tahlilgar/v1/forms' ),
                'nonce'    => wp_create_nonce( 'wp_rest' ) // Standard nonce for REST API
            )
        );
    }
}

// Hook into wp_enqueue_scripts to localize
add_action( 'wp_enqueue_scripts', function() {
    if ( is_page( 'form-builder' ) ) {
        // Enqueue WP API scripts to handle nonce automatically
        wp_enqueue_script( 'wp-api' );
        // Localize the script only on the form builder page
        tahlilgar_analyzer_localize_scripts('tahlilgar-form-builder-init');
    }
});