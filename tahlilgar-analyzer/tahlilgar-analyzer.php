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

    return $template;
}
add_filter( 'page_template', 'tahlilgar_analyzer_load_template' );