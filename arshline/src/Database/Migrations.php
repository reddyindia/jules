<?php

namespace Arshline\Database;

/**
 * Handles database migrations for the Arshline plugin.
 */
class Migrations {

    /**
     * Run all necessary migrations.
     *
     * This method checks the current database version and applies any pending migrations.
     */
    public static function run() {
        // In a real application, we would check a version number in wp_options.
        // For this initial setup, we'll just run the creation logic.
        self::create_tables();
    }

    /**
     * Create the custom tables for the plugin.
     */
    private static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

        // Table for Forms
        $table_forms = $wpdb->prefix . 'x_forms';
        $sql_forms = "CREATE TABLE $table_forms (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            schema_version VARCHAR(20) NOT NULL,
            owner_id BIGINT UNSIGNED,
            status VARCHAR(20) DEFAULT 'draft' NOT NULL,
            public_token VARCHAR(24) NULL,
            meta JSON NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY public_token_unique (public_token)
        ) $charset_collate;";
        dbDelta( $sql_forms );

        // Table for Fields
        $table_fields = $wpdb->prefix . 'x_fields';
        $sql_fields = "CREATE TABLE $table_fields (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            form_id BIGINT UNSIGNED NOT NULL,
            sort INT UNSIGNED DEFAULT 0,
            props JSON NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (form_id) REFERENCES $table_forms(id) ON DELETE CASCADE
        ) $charset_collate;";
        dbDelta( $sql_fields );

        // Table for Submissions
        $table_submissions = $wpdb->prefix . 'x_submissions';
        $sql_submissions = "CREATE TABLE $table_submissions (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            form_id BIGINT UNSIGNED NOT NULL,
            user_id BIGINT UNSIGNED NULL,
            ip VARCHAR(45) NULL,
            status VARCHAR(20) DEFAULT 'pending' NOT NULL,
            meta JSON NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (form_id) REFERENCES $table_forms(id) ON DELETE CASCADE
        ) $charset_collate;";
        dbDelta( $sql_submissions );

        // Table for Submission Values
        $table_submission_values = $wpdb->prefix . 'x_submission_values';
        $sql_submission_values = "CREATE TABLE $table_submission_values (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            submission_id BIGINT UNSIGNED NOT NULL,
            field_id BIGINT UNSIGNED NOT NULL,
            value TEXT,
            idx INT UNSIGNED DEFAULT 0,
            FOREIGN KEY (submission_id) REFERENCES $table_submissions(id) ON DELETE CASCADE,
            FOREIGN KEY (field_id) REFERENCES $table_fields(id) ON DELETE CASCADE
        ) $charset_collate;";
        dbDelta( $sql_submission_values );

        // Create the dedicated form viewer page if it doesn't exist
        if ( ! get_page_by_path( 'form' ) ) {
            wp_insert_post( array(
                'post_title'    => __( 'Form Viewer', 'arshline' ),
                'post_name'     => 'form',
                'post_status'   => 'publish',
                'post_author'   => 1,
                'post_type'     => 'page',
                'page_template' => 'src/Frontend/template-form-viewer.php'
            ) );
        }

        // Create the dedicated settings page if it doesn't exist
        if ( ! get_page_by_path( 'settings' ) ) {
            wp_insert_post( array(
                'post_title'    => __( 'Settings', 'arshline' ),
                'post_name'     => 'settings',
                'post_status'   => 'publish',
                'post_author'   => 1,
                'post_type'     => 'page',
                'page_template' => 'src/Dashboard/template-settings.php'
            ) );
        }
    }
}