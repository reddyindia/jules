<?php
/**
 * Template for the Tahlilgar Analyzer Results page.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

get_header();

// Get form ID from URL query parameter
$form_id = isset( $_GET['form_id'] ) ? intval( $_GET['form_id'] ) : 0;
$form_title = $form_id ? get_the_title( $form_id ) : 'نامشخص';

?>

<div class="tahlilgar-container">
    <div class="tahlilgar-sidebar">
        <div class="logo">
            <a href="#">تحلیلگر</a>
        </div>
        <ul class="tahlilgar-menu">
            <li><a href="<?php echo esc_url( home_url( '/dashboard' ) ); ?>"><span class="dashicons dashicons-dashboard"></span>داشبورد</a></li>
            <li class="active"><a href="<?php echo esc_url( home_url( '/form-management' ) ); ?>"><span class="dashicons dashicons-forms"></span>مدیریت فرم‌ها</a></li>
            <li><a href="<?php echo esc_url( home_url( '/form-builder' ) ); ?>"><span class="dashicons dashicons-plus-alt"></span>ساخت فرم جدید</a></li>
        </ul>
    </div>
    <div class="tahlilgar-main-content">
        <div class="tahlilgar-header">
            <h1>نتایج فرم: <?php echo esc_html( $form_title ); ?></h1>
            <a href="<?php echo esc_url( home_url( '/form-management' ) ); ?>" class="tahlilgar-button">
                <span class="dashicons dashicons-arrow-left-alt"></span>
                بازگشت به لیست فرم‌ها
            </a>
        </div>
        <div class="tahlilgar-card">
            <div id="loading-message">در حال بارگذاری نتایج...</div>
            <div id="no-submissions-message" style="display: none;">هیچ پاسخی برای این فرم ثبت نشده است.</div>
            <div id="submissions-list">
                <!-- Submission cards will be inserted here by JavaScript -->
            </div>
        </div>
    </div>
</div>

<?php
get_footer();
?>