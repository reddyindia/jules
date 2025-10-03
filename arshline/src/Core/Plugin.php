<?php

namespace Arshline\Core;

/**
 * Main plugin class.
 *
 * This class handles the initialization of the plugin and registers all the necessary hooks and modules.
 */
final class Plugin {

    /**
     * The single instance of the class.
     */
    private static $instance = null;

    /**
     * Main Arshline Plugin Instance.
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Plugin Constructor.
     */
    private function __construct() {
        $this->init_hooks();
        $this->init_updater();
    }

    /**
     * Hook into actions and filters.
     */
    private function init_hooks() {
        add_action('init', array($this, 'init_modules'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_filter('template_include', array($this, 'template_include'), 99);
    }

    /**
     * Initialize all plugin modules.
     */
    public function init_modules() {
        new Api();
    }

    /**
     * Initialize the plugin updater using metadata.json.
     */
    private function init_updater() {
        $puc_file = ARSHLINE_PLUGIN_PATH . 'plugin-update-checker/plugin-update-checker.php';
        if (file_exists($puc_file)) {
            require_once $puc_file;
            $myUpdateChecker = \YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
                'https://raw.githubusercontent.com/reddyindia/jules/main/metadata.json',
                ARSHLINE_PLUGIN_FILE,
                'arshline'
            );
        }
    }

    /**
     * Enqueue scripts and styles for the plugin pages.
     */
    public function enqueue_assets() {
        // Dashboard pages
        if (is_page('form-builder')) {
            wp_enqueue_style('form-builder-style', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.css');
            wp_enqueue_script('form-builder-script', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-builder.min.js', array('jquery', 'jquery-ui-core', 'jquery-ui-sortable'), '3.21.0', true);

            $script_path = ARSHLINE_PLUGIN_PATH . 'assets/js/form-builder-loader.js';
            wp_enqueue_script('arshline-form-builder-loader', ARSHLINE_PLUGIN_URL . 'assets/js/form-builder-loader.js', array('form-builder-script', 'wp-api'), filemtime($script_path), true);

            wp_localize_script('arshline-form-builder-loader', 'arshline_options', array(
                'rest_url' => get_rest_url(null, 'arshline/v1/forms'),
                'nonce'    => wp_create_nonce('wp_rest')
            ));
        } elseif (is_page('form-management')) {
            $script_path = ARSHLINE_PLUGIN_PATH . 'assets/js/form-management.js';
            wp_enqueue_script('arshline-form-management-script', ARSHLINE_PLUGIN_URL . 'assets/js/form-management.js', array('jquery', 'wp-api'), filemtime($script_path), true);

            wp_localize_script('arshline-form-management-script', 'arshline_options', array(
                'rest_url' => get_rest_url(null, 'arshline/v1/forms'),
                'nonce'    => wp_create_nonce('wp_rest')
            ));
        } elseif (is_page('settings')) {
            $script_path = ARSHLINE_PLUGIN_PATH . 'assets/js/settings.js';
            wp_enqueue_script('arshline-settings-script', ARSHLINE_PLUGIN_URL . 'assets/js/settings.js', array('jquery', 'wp-api'), filemtime($script_path), true);

            wp_localize_script('arshline-settings-script', 'arshline_settings_options', array(
                'rest_url' => get_rest_url(null, 'arshline/v1/settings/ai'),
                'nonce'    => wp_create_nonce('wp_rest')
            ));
        }

        // Public form viewer page
        if (isset($_GET['arshline_form'])) {
            wp_enqueue_script('form-render-js', 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.21.0/form-render.min.js', array('jquery'), '3.21.0', true);

            $script_path = ARSHLINE_PLUGIN_PATH . 'assets/js/form-viewer.js';
            wp_enqueue_script('arshline-form-viewer', ARSHLINE_PLUGIN_URL . 'assets/js/form-viewer.js', array('form-render-js'), ARSHLINE_VERSION, true);

            // Data is localized directly in the template `template-form-viewer.php` after fetching from DB.
        }
    }

    /**
     * Include custom page templates.
     */
    public function template_include($template) {
        // Handle the dedicated form viewer page
        if (isset($_GET['arshline_form'])) {
            $new_template = ARSHLINE_PLUGIN_PATH . 'src/Frontend/template-form-viewer.php';
            if (file_exists($new_template)) {
                return $new_template;
            }
        }

        $dashboard_templates = [
            'dashboard'       => 'template-dashboard.php',
            'form-builder'    => 'template-form-builder.php',
            'form-management' => 'template-form-management.php',
            'settings'        => 'template-settings.php',
            'results'         => 'template-results.php',
            'login'           => 'template-login.php',
        ];

        foreach ($dashboard_templates as $slug => $filename) {
            if (is_page($slug)) {
                $new_template = ARSHLINE_PLUGIN_PATH . 'src/Dashboard/' . $filename;
                if (file_exists($new_template)) {
                    return $new_template;
                }
            }
        }

        return $template;
    }
}