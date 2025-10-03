<?php

namespace Arshline\Core;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

/**
 * Handles the registration of REST API endpoints for the Arshline plugin.
 */
class Api {

    /**
     * API constructor.
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * Register all routes for the plugin.
     */
    public function register_routes() {
        // Route for getting and creating forms
        register_rest_route('arshline/v1', '/forms', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_forms_handler'),
                'permission_callback' => array($this, 'get_items_permissions_check'),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'create_form_handler'),
                'permission_callback' => array($this, 'create_item_permissions_check'),
            ),
        ));

        // Route for deleting a form
        register_rest_route('arshline/v1', '/forms/(?P<id>\\d+)', array(
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array($this, 'delete_form_handler'),
                'permission_callback' => array($this, 'delete_item_permissions_check'),
                'args'                => array(
                    'id' => array(
                        'validate_callback' => 'is_numeric',
                        'required' => true,
                    ),
                ),
            ),
        ));

        // Route for creating a submission
        register_rest_route('arshline/v1', '/submissions', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'create_submission_handler'),
                'permission_callback' => '__return_true', // Public endpoint
            ),
        ));

        // Route for AI settings
        register_rest_route('arshline/v1', '/settings/ai', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_ai_settings_handler'),
                'permission_callback' => array($this, 'manage_options_permission_check'),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE, // Using CREATABLE for POST
                'callback'            => array($this, 'save_ai_settings_handler'),
                'permission_callback' => array($this, 'manage_options_permission_check'),
            ),
        ));
    }

    /**
     * Check if a given request has permission to manage options.
     */
    public function manage_options_permission_check($request) {
        if (!current_user_can('manage_options')) {
            return new WP_Error('rest_forbidden', esc_html__('You do not have permissions to manage settings.', 'arshline'), array('status' => 403));
        }
        return true;
    }

    /**
     * Check if a given request has permission to get items.
     */
    public function get_items_permissions_check($request) {
        if (!current_user_can('edit_posts')) {
            return new WP_Error('rest_forbidden', esc_html__('You do not have permissions to view forms.', 'arshline'), array('status' => 401));
        }
        return true;
    }

    /**
     * Check if a given request has permission to create an item.
     */
    public function create_item_permissions_check($request) {
        if (!current_user_can('publish_posts')) {
            return new WP_Error('rest_forbidden', esc_html__('You do not have permissions to create forms.', 'arshline'), array('status' => 401));
        }
        return true;
    }

    /**
     * Check if a given request has permission to delete an item.
     */
    public function delete_item_permissions_check($request) {
        if (!current_user_can('publish_posts')) {
            return new WP_Error('rest_forbidden', esc_html__('You do not have permissions to delete forms.', 'arshline'), array('status' => 403));
        }
        return true;
    }

    /**
     * Get a collection of forms.
     */
    public function get_forms_handler($request) {
        global $wpdb;
        $forms_table = $wpdb->prefix . 'x_forms';
        $submissions_table = $wpdb->prefix . 'x_submissions';

        $query = $wpdb->prepare(
            "SELECT f.id, f.meta, f.status, f.created_at, COALESCE(sc.submission_count, 0) as submission_count
             FROM %i AS f
             LEFT JOIN (
                 SELECT form_id, COUNT(id) as submission_count
                 FROM %i
                 GROUP BY form_id
             ) AS sc ON f.id = sc.form_id
             ORDER BY f.created_at DESC",
            $forms_table,
            $submissions_table
        );
        $forms = $wpdb->get_results($query, ARRAY_A);

        if ($forms === null) {
            return new WP_Error('db_error', __('Could not retrieve forms.', 'arshline'), array('status' => 500));
        }

        $results_page = get_page_by_path('results');
        foreach ($forms as &$form) {
            $meta = json_decode($form['meta'], true);
            $form['title'] = isset($meta['title']) ? $meta['title'] : 'Untitled Form';
            $form['form_link'] = home_url('/?arshline_form=' . $form['id']);
            $form['results_link'] = $results_page ? add_query_arg('form_id', $form['id'], get_permalink($results_page->ID)) : '#';
        }

        return new WP_REST_Response($forms, 200);
    }

    /**
     * Create one form from the collection.
     */
    public function create_form_handler($request) {
        global $wpdb;
        $params = $request->get_json_params();

        $form_title = sanitize_text_field($params['title']);
        $form_schema = $params['schema'];

        if (empty($form_title) || !is_array($form_schema)) {
            return new WP_Error('invalid_data', __('Form title and schema are required.', 'arshline'), array('status' => 400));
        }

        $forms_table = $wpdb->prefix . 'x_forms';
        $result = $wpdb->insert(
            $forms_table,
            array(
                'schema_version' => '1.0',
                'owner_id'       => get_current_user_id(),
                'status'         => 'draft',
                'meta'           => json_encode(['title' => $form_title]),
            )
        );

        if ($result === false) {
            return new WP_Error('db_error', __('Could not create form.', 'arshline'), array('status' => 500));
        }

        $form_id = $wpdb->insert_id;

        $fields_table = $wpdb->prefix . 'x_fields';
        foreach ($form_schema as $index => $field_props) {
            $wpdb->insert(
                $fields_table,
                array(
                    'form_id' => $form_id,
                    'sort'    => $index,
                    'props'   => json_encode($field_props),
                )
            );
        }

        return new WP_REST_Response(array('id' => $form_id, 'message' => 'Form created successfully.'), 201);
    }

    /**
     * Delete one form from the collection.
     */
    public function delete_form_handler($request) {
        global $wpdb;
        $form_id = (int) $request['id'];
        $forms_table = $wpdb->prefix . 'x_forms';

        $form = $wpdb->get_row($wpdb->prepare("SELECT * FROM $forms_table WHERE id = %d", $form_id));
        if (!$form) {
            return new WP_Error('rest_not_found', __('Form not found.', 'arshline'), array('status' => 404));
        }

        $deleted = $wpdb->delete($forms_table, array('id' => $form_id), array('%d'));

        if ($deleted === false) {
            return new WP_Error('rest_cannot_delete', __('Error in deleting form.', 'arshline'), array('status' => 500));
        }

        return new WP_REST_Response(array('success' => true, 'message' => 'Form deleted successfully.'), 200);
    }

    /**
     * Create one submission from the collection.
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Response
     */
    public function create_submission_handler($request) {
        global $wpdb;
        $params = $request->get_json_params();

        $form_id = isset($params['form_id']) ? intval($params['form_id']) : 0;
        $submission_data = isset($params['submission_data']) ? $params['submission_data'] : array();

        if (empty($form_id) || empty($submission_data) || !is_array($submission_data)) {
            return new WP_Error('invalid_data', __('Form ID and submission data are required.', 'arshline'), array('status' => 400));
        }

        // Insert the main submission entry
        $submissions_table = $wpdb->prefix . 'x_submissions';
        $wpdb->insert(
            $submissions_table,
            array(
                'form_id' => $form_id,
                'user_id' => get_current_user_id(), // Returns 0 for non-logged-in users
                'ip'      => $this->get_client_ip(),
                'status'  => 'pending',
            )
        );
        $submission_id = $wpdb->insert_id;

        if (!$submission_id) {
            return new WP_Error('db_error', __('Could not create submission.', 'arshline'), array('status' => 500));
        }

        // Insert submission values
        $fields_table = $wpdb->prefix . 'x_fields';
        $values_table = $wpdb->prefix . 'x_submission_values';

        foreach ($submission_data as $field_data) {
            if (empty($field_data['name'])) {
                continue;
            }

            // Find the field_id by its "name" attribute stored in the props JSON
            $field_id = $wpdb->get_var($wpdb->prepare(
                "SELECT id FROM $fields_table WHERE form_id = %d AND JSON_UNQUOTE(JSON_EXTRACT(props, '$.name')) = %s",
                $form_id,
                $field_data['name']
            ));

            if ($field_id) {
                $value_to_store = is_array($field_data['value']) ? implode(', ', $field_data['value']) : $field_data['value'];
                $wpdb->insert(
                    $values_table,
                    array(
                        'submission_id' => $submission_id,
                        'field_id'      => $field_id,
                        'value'         => sanitize_textarea_field($value_to_store),
                    )
                );
            }
        }

        return new WP_REST_Response(array('success' => true, 'message' => 'Submission received successfully.'), 200);
    }

    /**
     * Get the client's IP address.
     *
     * @return string
     */
    private function get_client_ip() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return sanitize_text_field($_SERVER['HTTP_CLIENT_IP']);
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return sanitize_text_field($_SERVER['HTTP_X_FORWARDED_FOR']);
        } else {
            return sanitize_text_field($_SERVER['REMOTE_ADDR']);
        }
    }

    /**
     * Get AI settings.
     */
    public function get_ai_settings_handler($request) {
        $settings = get_option('arshline_ai_settings', array());
        $default_settings = array(
            'ai_base_url' => '',
            'ai_api_key'  => '',
        );
        $settings = wp_parse_args($settings, $default_settings);

        // Never expose the API key via GET requests for security
        if (!empty($settings['ai_api_key'])) {
            $settings['ai_api_key_set'] = true;
        } else {
            $settings['ai_api_key_set'] = false;
        }
        unset($settings['ai_api_key']);

        return new WP_REST_Response($settings, 200);
    }

    /**
     * Save AI settings.
     */
    public function save_ai_settings_handler($request) {
        $params = $request->get_json_params();
        $current_settings = get_option('arshline_ai_settings', array());

        $new_settings = array();
        $new_settings['ai_base_url'] = isset($params['ai_base_url']) ? esc_url_raw($params['ai_base_url']) : '';

        // Only update the API key if a new, non-empty one is provided
        if (!empty($params['ai_api_key'])) {
            $new_settings['ai_api_key'] = sanitize_text_field($params['ai_api_key']);
        } else {
            // Keep the old key if the new one is empty
            $new_settings['ai_api_key'] = isset($current_settings['ai_api_key']) ? $current_settings['ai_api_key'] : '';
        }

        update_option('arshline_ai_settings', $new_settings);

        return new WP_REST_Response(array('success' => true, 'message' => 'AI settings saved successfully.'), 200);
    }
}