<?php
/**
 * Plugin Name: تحلیلگر
 * Plugin URI: https://github.com/reddyindia/jules/
 * Description: یک افزونه وردپرسی پیشرفته برای ساخت و مدیریت فرم‌ها و تحلیل نتایج با ساختار مدرن و شیءگرا.
 * Version: 2.0.2
 * Author: Jules
 * Author URI: https://github.com/reddyindia/jules/
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Define plugin constants
define( 'TA_VERSION', '2.0.2' );
define( 'TA_PLUGIN_FILE', __FILE__ );
define( 'TA_PLUGIN_PATH', plugin_dir_path( TA_PLUGIN_FILE ) );
define( 'TA_PLUGIN_URL', plugin_dir_url( TA_PLUGIN_FILE ) );

// Include the main plugin class.
if ( ! class_exists( 'Tahlilgar_Analyzer' ) ) {
    include_once TA_PLUGIN_PATH . 'includes/class-tahlilgar-analyzer.php';
}

/**
 * Main instance of Tahlilgar_Analyzer.
 *
 * @return Tahlilgar_Analyzer
 */
function TA() {
    return Tahlilgar_Analyzer::instance();
}

// Get the plugin running.
TA();

// Activation hook.
register_activation_hook( __FILE__, array( 'Tahlilgar_Analyzer', 'activate' ) );

// Deactivation hook.
register_deactivation_hook( __FILE__, array( 'Tahlilgar_Analyzer', 'deactivate' ) );