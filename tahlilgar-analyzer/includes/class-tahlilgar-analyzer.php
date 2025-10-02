<?php
/**
 * Main plugin class.
 *
 * @package TahlilgarAnalyzer
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Tahlilgar_Analyzer main class.
 */
class Tahlilgar_Analyzer {

    /**
     * The single instance of the class.
     *
     * @var Tahlilgar_Analyzer
     */
    protected static $_instance = null;

    /**
     * Main Tahlilgar_Analyzer Instance.
     *
     * Ensures only one instance of Tahlilgar_Analyzer is loaded or can be loaded.
     *
     * @static
     * @return Tahlilgar_Analyzer - Main instance.
     */
    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Tahlilgar_Analyzer Constructor.
     */
    public function __construct() {
        $this->includes();
        $this->init_hooks();
        $this->init_updater();
    }

    /**
     * Initialize the plugin updater.
     */
    private function init_updater() {
        $puc_file = TA_PLUGIN_PATH . 'plugin-update-checker/plugin-update-checker.php';
        if ( file_exists( $puc_file ) ) {
            require_once $puc_file;
            $myUpdateChecker = YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
                'https://github.com/reddyindia/jules/',
                TA_PLUGIN_PATH . 'tahlilgar-analyzer.php',
                'tahlilgar-analyzer'
            );

            // Set the branch to check for releases
            $myUpdateChecker->setBranch('feat/arshline-phase1-form-builder-core');

            // Enable release assets to download the ZIP from releases
            $myUpdateChecker->getVcsApi()->enableReleaseAssets();
        }
    }

    /**
     * Include required files.
     */
    public function includes() {
        // Here we will include other classes.
    }

    /**
     * Hook into actions and filters.
     */
    private function init_hooks() {
        add_filter( 'template_include', array( $this, 'template_include' ), 99 );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
        add_action( 'wp_print_styles', array( $this, 'dequeue_theme_styles' ), 100 );
        add_action( 'init', array( $this, 'init' ) );
        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
    }

    /**
     * Initialize plugin functionality.
     * Hooks into 'init' action.
     */
    public function init() {
        $this->register_post_types();
        $this->register_shortcodes();
    }

    /**
     * Register shortcodes.
     */
    public function register_shortcodes() {
        add_shortcode( 'tahlilgar_form', array( $this, 'form_shortcode_handler' ) );
    }


    /**
     * Shortcode handler for displaying a form.
     */
    public function form_shortcode_handler( $atts ) {
        $atts = shortcode_atts( array( 'id' => 0 ), $atts, 'tahlilgar_form' );
        $form_id = intval( $atts['id'] );

        if ( ! $form_id ) {
            return '<p style="color: red;">' . __( 'Error: Form ID is not specified.', 'tahlilgar-analyzer' ) . '</p>';
        }

        $form_post = get_post( $form_id );

        if ( ! $form_post || 'tahlilgar_form' !== $form_post->post_type ) {
            return '<p style="color: red;">' . __( 'Error: Form not found.', 'tahlilgar-analyzer' ) . '</p>';
        }

        wp_enqueue_script( 'form-render-js', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-render.min.js', array( 'jquery' ), '3.21.0', true );
        wp_enqueue_script( 'tahlilgar-form-renderer-init', TA_PLUGIN_URL . 'assets/js/form-renderer-init.js', array( 'form-render-js' ), filemtime( TA_PLUGIN_PATH . 'assets/js/form-renderer-init.js' ), true );

        $form_data = json_decode( $form_post->post_content, true );
        wp_localize_script( 'tahlilgar-form-renderer-init', 'tahlilgar_renderer_data', array(
            'form_id'        => $form_id,
            'form_json'      => $form_data,
            'submission_url' => get_rest_url( null, 'tahlilgar/v1/submissions/' . $form_id ),
            'nonce'          => wp_create_nonce( 'wp_rest' )
        ) );

        return '<div id="tahlilgar-form-render-' . esc_attr( $form_id ) . '" class="tahlilgar-form-render-area"></div>';
    }

    /**
     * Register custom REST API routes.
     */
    public function register_rest_routes() {
        // Routes for /forms
        register_rest_route( 'tahlilgar/v1', '/forms', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'save_form_rest_handler' ),
                'permission_callback' => function () { return current_user_can( 'publish_posts' ); },
                'args'                => array(
                    'form_title' => array( 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ),
                    'form_data'  => array( 'required' => true ),
                ),
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_forms_handler' ),
                'permission_callback' => function () { return current_user_can( 'publish_posts' ); },
            ),
        ) );

        // Routes for /submissions/{id}
        register_rest_route( 'tahlilgar/v1', '/submissions/(?P<id>\\d+)', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'save_submission_rest_handler' ),
                'permission_callback' => '__return_true',
                'args'                => array( 'id' => array( 'validate_callback' => function($param) { return is_numeric($param); } ) ),
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_submissions_handler' ),
                'permission_callback' => function () { return current_user_can( 'publish_posts' ); },
                'args'                => array( 'id' => array( 'validate_callback' => function($param) { return is_numeric($param); } ) ),
            ),
        ) );
    }

    /**
     * REST API handler for saving a form.
     */
    public function save_form_rest_handler( WP_REST_Request $request ) {
        $form_title = $request->get_param( 'form_title' );
        $form_data  = $request->get_param( 'form_data' );

        if ( empty( $form_data ) ) {
            return new WP_Error( 'no_data', 'No form data received.', array( 'status' => 400 ) );
        }

        $post_id = wp_insert_post( array(
            'post_title'   => $form_title,
            'post_content' => wp_json_encode( $form_data, JSON_UNESCAPED_UNICODE ),
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

    /**
     * REST API handler for getting forms.
     */
    public function get_forms_handler() {
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
     * REST API handler for saving a submission.
     */
    public function save_submission_rest_handler( WP_REST_Request $request ) {
        $form_id = (int) $request['id'];
        $submission_data = $request->get_json_params();

        if ( empty( $submission_data ) ) {
            return new WP_Error( 'no_data', 'No submission data received.', array( 'status' => 400 ) );
        }

        $form_title = get_the_title( $form_id );
        $submission_title = sprintf( 'پاسخ برای فرم "%s" - %s', $form_title, wp_date( 'Y-m-d H:i:s' ) );

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
            'post_parent'  => $form_id,
        ) );

        if ( is_wp_error( $post_id ) ) {
            return new WP_Error( 'save_error', $post_id->get_error_message(), array( 'status' => 500 ) );
        }

        return new WP_REST_Response( array( 'success' => true, 'message' => 'Submission received successfully!' ), 200 );
    }

    /**
     * REST API handler for getting submissions.
     */
    public function get_submissions_handler( WP_REST_Request $request ) {
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
     * Register custom post types.
     */
    public function register_post_types() {
        // Register tahlilgar_form CPT
        register_post_type( 'tahlilgar_form', array(
            'public'      => false,
            'show_ui'     => true,
            'label'       => __( 'Tahlilgar Forms', 'tahlilgar-analyzer' ),
            'labels'      => array(
                'name'          => __( 'Forms', 'tahlilgar-analyzer' ),
                'singular_name' => __( 'Form', 'tahlilgar-analyzer' ),
                'add_new_item'  => __( 'Add New Form', 'tahlilgar-analyzer' ),
            ),
            'supports'    => array( 'title' ),
            'menu_icon'   => 'dashicons-list-view',
            'show_in_menu'=> false,
        ) );

        // Register tahlilgar_submission CPT
        register_post_type( 'tahlilgar_submission', array(
            'public'      => false,
            'show_ui'     => true,
            'label'       => __( 'Submissions', 'tahlilgar-analyzer' ),
            'labels'      => array(
                'name'          => __( 'Submissions', 'tahlilgar-analyzer' ),
                'singular_name' => __( 'Submission', 'tahlilgar-analyzer' ),
            ),
            'supports'    => array( 'title', 'editor', 'author' ),
            'menu_icon'   => 'dashicons-inbox',
            'show_in_menu'=> false,
        ) );
    }

    /**
     * Dequeue conflicting theme styles on plugin pages.
     */
    public function dequeue_theme_styles() {
        if ( is_page( array( 'dashboard', 'form-builder', 'form-management', 'results' ) ) ) {
            global $wp_styles;
            $allowed_styles = array(
                'tahlilgar-dashboard-style',
                'form-builder-style',
                'tahlilgar-form-builder-theme',
                'dashicons',
                'admin-bar',
            );
            if ( ! empty( $wp_styles->queue ) ) {
                foreach ( $wp_styles->queue as $handle ) {
                    if ( ! in_array( $handle, $allowed_styles, true ) ) {
                        wp_dequeue_style( $handle );
                    }
                }
            }
        }
    }

    /**
     * Enqueue assets for the plugin's pages.
     */
    public function enqueue_assets() {
        $is_plugin_page = is_page( array( 'dashboard', 'form-builder', 'form-management', 'results' ) );

        // Common assets for all plugin pages
        if ( $is_plugin_page ) {
            wp_enqueue_style('tahlilgar-dashboard-style', TA_PLUGIN_URL . 'assets/css/dashboard.css', array(), filemtime( TA_PLUGIN_PATH . 'assets/css/dashboard.css' ));
            wp_enqueue_script('tahlilgar-dashboard-script', TA_PLUGIN_URL . 'assets/js/dashboard.js', array( 'jquery' ), filemtime( TA_PLUGIN_PATH . 'assets/js/dashboard.js' ), true);
            wp_enqueue_script( 'wp-api' ); // Needed for REST API nonces
        }

        // Form builder specific assets
        if ( is_page( 'form-builder' ) ) {
            wp_enqueue_style( 'form-builder-style', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.css' );
            wp_enqueue_style('tahlilgar-form-builder-theme', TA_PLUGIN_URL . 'assets/css/form-builder-theme.css', array(), filemtime( TA_PLUGIN_PATH . 'assets/css/form-builder-theme.css' ));
            wp_enqueue_script( 'form-builder-script', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.js', array( 'jquery', 'jquery-ui-core', 'jquery-ui-sortable' ), '3.21.0', true );
            wp_enqueue_script('tahlilgar-form-builder-loader', TA_PLUGIN_URL . 'assets/js/form-builder-loader.js', array( 'form-builder-script', 'wp-api' ), filemtime( TA_PLUGIN_PATH . 'assets/js/form-builder-loader.js' ), true);

            wp_localize_script( 'tahlilgar-form-builder-loader', 'tahlilgar_form_builder', array(
                'rest_url' => get_rest_url( null, 'tahlilgar/v1/forms' ),
                'nonce'    => wp_create_nonce( 'wp_rest' )
            ) );
        }

        // Form management specific assets
        if ( is_page( 'form-management' ) ) {
            wp_enqueue_script('tahlilgar-form-management-script', TA_PLUGIN_URL . 'assets/js/form-management.js', array( 'jquery', 'wp-api' ), filemtime( TA_PLUGIN_PATH . 'assets/js/form-management.js' ), true);
            wp_localize_script( 'tahlilgar-form-management-script', 'tahlilgar_management_data', array(
                'rest_url' => get_rest_url( null, 'tahlilgar/v1/forms' ),
                'nonce'    => wp_create_nonce( 'wp_rest' )
            ) );
        }

        // Results page specific assets
        if ( is_page( 'results' ) ) {
            wp_enqueue_script('tahlilgar-results-script', TA_PLUGIN_URL . 'assets/js/results.js', array( 'jquery', 'wp-api' ), filemtime( TA_PLUGIN_PATH . 'assets/js/results.js' ), true);
            wp_localize_script( 'tahlilgar-results-script', 'tahlilgar_results_data', array(
                'rest_url_base' => get_rest_url( null, 'tahlilgar/v1/submissions/' ),
                'nonce'         => wp_create_nonce( 'wp_rest' )
            ) );
        }
    }

    /**
     * Include custom page templates.
     *
     * @param string $template The path of the template to include.
     * @return string
     */
    public function template_include( $template ) {
        $pages_and_templates = array(
            'dashboard'       => 'template-dashboard.php',
            'login'           => 'template-login.php',
            'form-builder'    => 'template-form-builder.php',
            'form-management' => 'template-form-management.php',
            'results'         => 'template-results.php',
        );

        foreach ( $pages_and_templates as $page_slug => $template_file ) {
            if ( is_page( $page_slug ) ) {
                $new_template = TA_PLUGIN_PATH . $template_file;
                if ( file_exists( $new_template ) ) {
                    return $new_template;
                }
            }
        }

        return $template;
    }

    /**
     * Plugin activation.
     * Creates the necessary pages for the plugin to function.
     */
    public static function activate() {
        // Dashboard Page
        if ( ! get_page_by_path( 'dashboard' ) ) {
            wp_insert_post( array(
                'post_title'    => __( 'Dashboard', 'tahlilgar-analyzer' ),
                'post_name'     => 'dashboard',
                'post_status'   => 'publish',
                'post_author'   => 1,
                'post_type'     => 'page',
                'page_template' => 'template-dashboard.php'
            ) );
        }

        // Login Page
        if ( ! get_page_by_path( 'login' ) ) {
            wp_insert_post( array(
                'post_title'    => __( 'Login', 'tahlilgar-analyzer' ),
                'post_name'     => 'login',
                'post_status'   => 'publish',
                'post_author'   => 1,
                'post_type'     => 'page',
                'page_template' => 'template-login.php'
            ) );
        }

        // Form Builder Page
        if ( ! get_page_by_path( 'form-builder' ) ) {
            wp_insert_post( array(
                'post_title'    => __( 'Form Builder', 'tahlilgar-analyzer' ),
                'post_name'     => 'form-builder',
                'post_status'   => 'publish',
                'post_author'   => 1,
                'post_type'     => 'page',
                'page_template' => 'template-form-builder.php'
            ) );
        }

        // Form Management Page
        if ( ! get_page_by_path( 'form-management' ) ) {
            wp_insert_post( array(
                'post_title'    => __( 'Form Management', 'tahlilgar-analyzer' ),
                'post_name'     => 'form-management',
                'post_status'   => 'publish',
                'post_author'   => 1,
                'post_type'     => 'page',
                'page_template' => 'template-form-management.php'
            ) );
        }

        // Results Page
        if ( ! get_page_by_path( 'results' ) ) {
            wp_insert_post( array(
                'post_title'    => __( 'Results', 'tahlilgar-analyzer' ),
                'post_name'     => 'results',
                'post_status'   => 'publish',
                'post_author'   => 1,
                'post_type'     => 'page',
                'page_template' => 'template-results.php'
            ) );
        }

        // Flush rewrite rules to make sure the new pages are accessible
        flush_rewrite_rules();
    }
}