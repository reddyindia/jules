<?php
/**
 * Plugin Name: Arshline Form Builder
 * Plugin URI: https://github.com/reddyindia/jules/
 * Description: A modern, AI-powered form builder for WordPress with a dedicated dashboard and advanced features.
 * Version: 6.4.5
 * Author: Arshline Development Group
 * Author URI: https://arshline.ir/
 * License: GPL2
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Define plugin constants
define( 'ARSHLINE_VERSION', '6.4.5' );
define( 'ARSHLINE_PLUGIN_FILE', __FILE__ );
define( 'ARSHLINE_PLUGIN_PATH', plugin_dir_path( ARSHLINE_PLUGIN_FILE ) );
define( 'ARSHLINE_PLUGIN_URL', plugin_dir_url( ARSHLINE_PLUGIN_FILE ) );

// Simple PSR-4 autoloader
spl_autoload_register(function ($class) {
    $prefix = 'Arshline\\';
    $base_dir = __DIR__ . '/src/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

/**
 * The main function for that returns the one true Arshline instance.
 *
 * @return \Arshline\Core\Plugin
 */
function Arshline() {
    return \Arshline\Core\Plugin::instance();
}

// Activation hook to run migrations.
register_activation_hook( __FILE__, function() {
    require_once ARSHLINE_PLUGIN_PATH . 'src/Database/Migrations.php';
    \Arshline\Database\Migrations::run();
});

// Get the plugin running.
Arshline();