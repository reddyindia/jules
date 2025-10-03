<?php
/**
 * Template Name: Arshline Form Viewer
 *
 * This template is used to display a single form for public viewing and submission.
 * Scripts are enqueued centrally via the Core\Plugin class.
 */

// Get form ID from URL query parameter
$form_id = isset($_GET['arshline_form']) ? intval($_GET['arshline_form']) : 0;

if (!$form_id) {
    // Instead of dying, maybe show a gentler message or redirect.
    // For now, we'll keep it simple.
    get_header();
    echo '<div id="primary" class="content-area"><main id="main" class="site-main" role="main">';
    echo '<p>' . esc_html__('Form not specified.', 'arshline') . '</p>';
    echo '</main></div>';
    get_footer();
    return;
}

global $wpdb;
$forms_table = $wpdb->prefix . 'x_forms';
$fields_table = $wpdb->prefix . 'x_fields';

// Fetch form details
$form = $wpdb->get_row($wpdb->prepare("SELECT * FROM $forms_table WHERE id = %d", $form_id));

// Check form status
if (!$form || $form->status !== 'publish') {
    get_header();
    echo '<div id="primary" class="content-area"><main id="main" class="site-main" role="main">';
    echo '<p>' . esc_html__('Form not found or is not currently active.', 'arshline') . '</p>';
    echo '</main></div>';
    get_footer();
    return;
}

// Fetch form fields
$fields = $wpdb->get_results($wpdb->prepare("SELECT props FROM $fields_table WHERE form_id = %d ORDER BY sort ASC", $form_id));

$form_schema = array_map(function($field) {
    return json_decode($field->props, true);
}, $fields);

$form_meta = json_decode($form->meta, true);
$form_title = isset($form_meta['title']) ? $form_meta['title'] : __('Untitled Form', 'arshline');

// Pass data to the script. The script itself is enqueued in Plugin.php
wp_localize_script('arshline-form-viewer', 'arshline_viewer_options', array(
    'form_id'        => $form_id,
    'form_schema'    => $form_schema,
    'submission_url' => get_rest_url(null, 'arshline/v1/submissions'),
    'nonce'          => wp_create_nonce('wp_rest'),
));

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
        <article class="arshline-form-container">
            <header class="entry-header">
                <h1 class="entry-title"><?php echo esc_html($form_title); ?></h1>
            </header>
            <div class="entry-content">
                <div id="arshline-form-render-area"></div>
                <div id="arshline-form-status"></div>
            </div>
        </article>
    </main>
</div>

<?php get_footer();