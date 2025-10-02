<?php
/**
 * Plugin Name: تحلیلگر
 * Plugin URI: https://example.com/
 * Description: A simple WordPress plugin.
 * Version: 1.1.3
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
            'post_content'  => '', 'post_status'   => 'publish', 'post_author'   => 1, 'post_type'     => 'page',
            'page_template' => 'template-form-builder.php'
        );
        wp_insert_post( $form_builder_page );
    }

    // Form Management Page
    if ( ! get_page_by_path( 'form-management' ) ) {
        $form_management_page = array(
            'post_title'    => __( 'Form Management', 'tahlilgar-analyzer' ),
            'post_name'     => 'form-management',
            'post_content'  => '', 'post_status'   => 'publish', 'post_author'   => 1, 'post_type'     => 'page',
            'page_template' => 'template-form-management.php'
        );
        wp_insert_post( $form_management_page );
    }

    // Results Page (as a placeholder, might not be directly accessible)
    if ( ! get_page_by_path( 'results' ) ) {
        $results_page = array(
            'post_title'    => __( 'Results', 'tahlilgar-analyzer' ),
            'post_name'     => 'results',
            'post_content'  => '', 'post_status'   => 'publish', 'post_author'   => 1, 'post_type'     => 'page',
            'page_template' => 'template-results.php'
        );
        wp_insert_post( $results_page );
    }
}
// Run page creation on init to ensure pages exist, especially after plugin updates.
add_action( 'init', 'tahlilgar_analyzer_create_pages' );

/**
 * Include custom page templates.
 * This is more reliable for block themes than the 'page_template' filter.
 *
 * @param string $template The path of the template to include.
 * @return string
 */
function tahlilgar_analyzer_template_include( $template ) {
    $pages_and_templates = array(
        'dashboard'       => 'template-dashboard.php',
        'login'           => 'template-login.php',
        'form-builder'    => 'template-form-builder.php',
        'form-management' => 'template-form-management.php',
        'results'         => 'template-results.php',
    );

    foreach ( $pages_and_templates as $page_slug => $template_file ) {
        if ( is_page( $page_slug ) ) {
            $new_template = plugin_dir_path( __FILE__ ) . $template_file;
            if ( file_exists( $new_template ) ) {
                return $new_template;
            }
        }
    }

    return $template;
}
add_filter( 'template_include', 'tahlilgar_analyzer_template_include', 99 );

/**
 * Enqueue assets for the plugin's pages.
 */
function tahlilgar_analyzer_enqueue_assets() {
    $is_plugin_page = is_page( array( 'dashboard', 'form-builder', 'form-management', 'results' ) );

    // Load common dashboard styles and scripts on all plugin pages.
    if ( $is_plugin_page ) {
        wp_enqueue_style('tahlilgar-dashboard-style', plugin_dir_url( __FILE__ ) . 'assets/css/dashboard.css', array(), filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/dashboard.css' ));
        wp_enqueue_script('tahlilgar-dashboard-script', plugin_dir_url( __FILE__ ) . 'assets/js/dashboard.js', array( 'jquery' ), filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/dashboard.js' ), true);
        wp_enqueue_script( 'wp-api' ); // Needed for REST API nonces
    }

    // Form builder specific assets
    if ( is_page( 'form-builder' ) ) {
        wp_enqueue_style( 'form-builder-style', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.css' );
        wp_enqueue_style('tahlilgar-form-builder-theme', plugin_dir_url( __FILE__ ) . 'assets/css/form-builder-theme.css', array( 'tahlilgar-dashboard-style', 'form-builder-style' ), filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/form-builder-theme.css' ));
        wp_enqueue_script( 'form-builder-script', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.js', array( 'jquery', 'jquery-ui-core', 'jquery-ui-sortable' ), '3.21.0', true );
        wp_enqueue_script('tahlilgar-form-builder-custom-fields', plugin_dir_url( __FILE__ ) . 'assets/js/form-builder-custom-fields.js', array( 'form-builder-script' ), filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/form-builder-custom-fields.js' ), true);
        wp_enqueue_script('tahlilgar-form-builder-init', plugin_dir_url( __FILE__ ) . 'assets/js/form-builder-init.js', array( 'form-builder-script', 'tahlilgar-form-builder-custom-fields', 'wp-api' ), filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/form-builder-init.js' ), true);
    }

    // Form management specific assets
    if ( is_page( 'form-management' ) ) {
        wp_enqueue_script('tahlilgar-form-management-script', plugin_dir_url( __FILE__ ) . 'assets/js/form-management.js', array( 'jquery', 'wp-api' ), filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/form-management.js' ), true);
    }

    // Results page specific assets
    if ( is_page( 'results' ) ) {
        wp_enqueue_script('tahlilgar-results-script', plugin_dir_url( __FILE__ ) . 'assets/js/results.js', array( 'jquery', 'wp-api' ), filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/results.js' ), true);
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
        'show_in_menu'=> false, // Hide from main admin menu
    );
    register_post_type( 'tahlilgar_form', $args );
}
add_action( 'init', 'tahlilgar_analyzer_register_form_cpt' );

/**
 * Register a custom post type for submissions.
 */
function tahlilgar_analyzer_register_submission_cpt() {
    $args = array(
        'public'      => false,
        'show_ui'     => true,
        'label'       => __( 'Submissions', 'tahlilgar-analyzer' ),
        'labels'      => array(
            'name'          => __( 'Submissions', 'tahlilgar-analyzer' ),
            'singular_name' => __( 'Submission', 'tahlilgar-analyzer' ),
        ),
        'supports'    => array( 'title', 'editor', 'author' ),
        'menu_icon'   => 'dashicons-inbox',
        'show_in_menu'=> false, // Hide from main admin menu
    );
    register_post_type( 'tahlilgar_submission', $args );
}
add_action( 'init', 'tahlilgar_analyzer_register_submission_cpt' );


/**
 * Register custom REST API endpoint for saving forms.
 */
function tahlilgar_analyzer_register_rest_routes() {
    // Register routes for /forms (GET and POST)
    register_rest_route( 'tahlilgar/v1', '/forms', array(
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'tahlilgar_analyzer_save_form_rest_handler',
            'permission_callback' => function () { return current_user_can( 'publish_posts' ); },
            'args'                => array(
                'form_title' => array( 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ),
                'form_data'  => array( 'required' => true ),
            ),
        ),
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'tahlilgar_analyzer_get_forms_handler',
            'permission_callback' => function () { return current_user_can( 'publish_posts' ); },
        ),
    ) );

    // Register routes for /submissions/{id} (GET and POST)
    register_rest_route( 'tahlilgar/v1', '/submissions/(?P<id>\\d+)', array(
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'tahlilgar_analyzer_save_submission_rest_handler',
            'permission_callback' => '__return_true',
            'args'                => array( 'id' => array( 'validate_callback' => function($param) { return is_numeric($param); } ) ),
        ),
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'tahlilgar_analyzer_get_submissions_handler',
            'permission_callback' => function () { return current_user_can( 'publish_posts' ); },
            'args'                => array( 'id' => array( 'validate_callback' => function($param) { return is_numeric($param); } ) ),
        ),
    ) );
}
add_action( 'rest_api_init', 'tahlilgar_analyzer_register_rest_routes' );

/**
 * REST API handler for getting submissions for a specific form.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function tahlilgar_analyzer_get_submissions_handler( WP_REST_Request $request ) {
    $form_id = (int) $request['id'];

    $args = array(
        'post_type'      => 'tahlilgar_submission',
        'post_parent'    => $form_id,
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $submissions_query = new WP_Query( $args );
    $submissions_data = array();

    if ( $submissions_query->have_posts() ) {
        while ( $submissions_query->have_posts() ) {
            $submissions_query->the_post();
            $submissions_data[] = array(
                'id'      => get_the_ID(),
                'title'   => get_the_title(),
                'date'    => get_the_date(),
                'content' => get_the_content(),
            );
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response( $submissions_data, 200 );
}

/**
 * REST API handler for getting the list of forms.
 *
 * @return WP_REST_Response
 */
function tahlilgar_analyzer_get_forms_handler() {
    $args = array(
        'post_type'      => 'tahlilgar_form',
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $forms_query = new WP_Query( $args );
    $forms_data = array();

    if ( $forms_query->have_posts() ) {
        $results_page_url = get_permalink( get_page_by_path( 'results' ) );

        while ( $forms_query->have_posts() ) {
            $forms_query->the_post();
            $form_id = get_the_ID();

            // Count submissions for this form
            $submission_query = new WP_Query(array(
                'post_type' => 'tahlilgar_submission',
                'post_parent' => $form_id,
                'posts_per_page' => -1,
                'fields' => 'ids'
            ));
            $submission_count = $submission_query->post_count;

            $results_link = $results_page_url ? add_query_arg( 'form_id', $form_id, $results_page_url ) : '#';

            $forms_data[] = array(
                'id'          => $form_id,
                'title'       => get_the_title(),
                'date'        => get_the_date(),
                'shortcode'   => '[tahlilgar_form id="' . $form_id . '"]',
                'results_link'=> $results_link,
                'submission_count' => $submission_count,
            );
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response( $forms_data, 200 );
}

/**
 * REST API handler for saving a form submission.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function tahlilgar_analyzer_save_submission_rest_handler( WP_REST_Request $request ) {
    $form_id = (int) $request['id'];
    $submission_data = $request->get_json_params();

    if ( empty( $submission_data ) ) {
        return new WP_Error( 'no_data', 'No submission data received.', array( 'status' => 400 ) );
    }

    // Create a title for the submission
    $form_title = get_the_title( $form_id );
    $submission_title = sprintf( 'پاسخ برای فرم "%s" - %s', $form_title, wp_date( 'Y-m-d H:i:s' ) );

    // Format the submission data for storage in post_content
    $content = '';
    foreach ( $submission_data as $field ) {
        if ( ! isset( $field['name'] ) || ! isset( $field['label'] ) || ! isset( $field['value'] ) ) {
            continue;
        }
        $label = sanitize_text_field( $field['label'] );
        $value = is_array($field['value']) ? implode(', ', array_map('sanitize_text_field', $field['value'])) : sanitize_textarea_field( $field['value'] );
        $content .= "<strong>" . esc_html( $label ) . ":</strong>\n";
        $content .= esc_html( $value ) . "\n\n";
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $submission_title,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_type'    => 'tahlilgar_submission',
        'post_parent'  => $form_id, // Link submission to the form
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'save_error', $post_id->get_error_message(), array( 'status' => 500 ) );
    }

    return new WP_REST_Response( array( 'success' => true, 'message' => 'Submission received successfully!' ), 200 );
}

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
function tahlilgar_analyzer_localize_scripts() {
    if ( is_page( 'form-builder' ) ) {
        wp_localize_script(
            'tahlilgar-form-builder-init',
            'tahlilgar_form_builder',
            array(
                'rest_url' => get_rest_url( null, 'tahlilgar/v1/forms' ),
                'nonce'    => wp_create_nonce( 'wp_rest' )
            )
        );
    }

    if ( is_page( 'form-management' ) ) {
        wp_localize_script(
            'tahlilgar-form-management-script',
            'tahlilgar_management_data',
            array(
                'rest_url' => get_rest_url( null, 'tahlilgar/v1/forms' ),
                'nonce'    => wp_create_nonce( 'wp_rest' )
            )
        );
    }

    if ( is_page( 'results' ) ) {
        wp_localize_script(
            'tahlilgar-results-script',
            'tahlilgar_results_data',
            array(
                'rest_url_base' => get_rest_url( null, 'tahlilgar/v1/submissions/' ),
                'nonce'         => wp_create_nonce( 'wp_rest' )
            )
        );
    }
}

// Hook into wp_enqueue_scripts to localize
add_action( 'wp_enqueue_scripts', function() {
    // Enqueue WP API scripts to handle nonce automatically on our pages
    if ( is_page( 'form-builder' ) || is_page( 'form-management' ) || is_page( 'results' ) ) {
        wp_enqueue_script( 'wp-api' );
    }
    // Localize the scripts
    tahlilgar_analyzer_localize_scripts();
});

/**
 * Shortcode handler for displaying a form.
 *
 * @param array $atts Shortcode attributes.
 * @return string The HTML output for the form.
 */
function tahlilgar_analyzer_form_shortcode_handler( $atts ) {
    $atts = shortcode_atts( array(
        'id' => 0,
    ), $atts, 'tahlilgar_form' );

    $form_id = intval( $atts['id'] );

    if ( ! $form_id ) {
        return '<p style="color: red;">' . __( 'Error: Form ID is not specified.', 'tahlilgar-analyzer' ) . '</p>';
    }

    $form_post = get_post( $form_id );

    if ( ! $form_post || 'tahlilgar_form' !== $form_post->post_type ) {
        return '<p style="color: red;">' . __( 'Error: Form not found.', 'tahlilgar-analyzer' ) . '</p>';
    }

    // Enqueue form-render assets
    wp_enqueue_script(
        'form-render-js',
        'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-render.min.js',
        array( 'jquery' ),
        '3.21.0',
        true
    );

    wp_enqueue_script(
        'tahlilgar-form-renderer-init',
        plugin_dir_url( __FILE__ ) . 'assets/js/form-renderer-init.js',
        array( 'form-render-js' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/form-renderer-init.js' ),
        true
    );

    // Pass form data to the script
    $form_data = json_decode( $form_post->post_content, true );
    wp_localize_script( 'tahlilgar-form-renderer-init', 'tahlilgar_renderer_data', array(
        'form_id'        => $form_id,
        'form_json'      => $form_data,
        'submission_url' => get_rest_url( null, 'tahlilgar/v1/submissions/' . $form_id ),
        'nonce'          => wp_create_nonce( 'wp_rest' )
    ) );

    return '<div id="tahlilgar-form-render-' . esc_attr( $form_id ) . '" class="tahlilgar-form-render-area"></div>';
}
add_shortcode( 'tahlilgar_form', 'tahlilgar_analyzer_form_shortcode_handler' );

// --- GitHub Plugin Updater (Temporarily Disabled) ---
/*
require plugin_dir_path(__FILE__) . 'plugin-update-checker/plugin-update-checker.php';

$myUpdateChecker = YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
    'https://github.com/reddyindia/jules/',
    __FILE__,
    'tahlilgar-analyzer'
);

// Set the branch that contains the stable release.
$myUpdateChecker->setBranch('main');
*/