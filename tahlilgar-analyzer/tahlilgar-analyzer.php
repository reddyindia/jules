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

        // Local init script
        wp_enqueue_script(
            'tahlilgar-form-builder-init',
            plugin_dir_url( __FILE__ ) . 'assets/js/form-builder-init.js',
            array( 'form-builder-script' ), // Depends on the CDN script
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
 * AJAX handler for saving the form.
 */
function tahlilgar_analyzer_save_form_ajax() {
    // Check for nonce security. The action name must match the one used in wp_create_nonce.
    if ( ! check_ajax_referer( 'save_tahlilgar_form', 'security' ) ) {
        wp_send_json_error( 'Invalid nonce' );
    }

    // Check user capabilities
    if ( ! current_user_can( 'publish_posts' ) ) {
        wp_send_json_error( 'You do not have permission to save forms.' );
    }

    $form_data = isset( $_POST['form_data'] ) ? wp_unslash( $_POST['form_data'] ) : '';
    $form_title = isset( $_POST['form_title'] ) ? sanitize_text_field( $_POST['form_title'] ) : 'Untitled Form';

    if ( empty( $form_data ) ) {
        wp_send_json_error( 'No form data received.' );
    }

    // Create a new post of our CPT
    $post_id = wp_insert_post( array(
        'post_title'   => $form_title,
        'post_content' => $form_data, // Storing JSON in post_content
        'post_status'  => 'publish',
        'post_type'    => 'tahlilgar_form',
    ) );

    if ( is_wp_error( $post_id ) ) {
        wp_send_json_error( $post_id->get_error_message() );
    } else {
        wp_send_json_success( array( 'post_id' => $post_id, 'message' => 'Form saved successfully!' ) );
    }
}
add_action( 'wp_ajax_save_tahlilgar_form', 'tahlilgar_analyzer_save_form_ajax' );

// In the enqueue function, we need to localize the script to pass ajax_url and nonce
function tahlilgar_analyzer_localize_scripts( $handle ) {
    if ( $handle === 'tahlilgar-form-builder-init' ) {
        wp_localize_script(
            'tahlilgar-form-builder-init',
            'tahlilgar_form_builder',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce'    => wp_create_nonce( 'save_tahlilgar_form' ) // Action name must match the AJAX action
            )
        );
    }
}

// Hook into wp_enqueue_scripts to localize
add_action( 'wp_enqueue_scripts', function() {
    if ( is_page( 'form-builder' ) ) {
        // Localize the script only on the form builder page
        tahlilgar_analyzer_localize_scripts('tahlilgar-form-builder-init');
    }
});