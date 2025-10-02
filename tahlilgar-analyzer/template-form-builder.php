<?php
/**
 * Template for the Tahlilgar Analyzer Form Builder page.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

get_header();
?>

<div class="tahlilgar-container">
    <div class="tahlilgar-sidebar">
        <div class="logo">
            <a href="#">تحلیلگر</a>
        </div>
        <ul class="tahlilgar-menu">
            <li><a href="<?php echo esc_url( ta_get_dashboard_url() ); ?>"><span class="dashicons dashicons-dashboard"></span>داشبورد</a></li>
            <li><a href="<?php echo esc_url( ta_get_form_management_url() ); ?>"><span class="dashicons dashicons-forms"></span>مدیریت فرم‌ها</a></li>
            <li class="active"><a href="<?php echo esc_url( ta_get_form_builder_url() ); ?>"><span class="dashicons dashicons-plus-alt"></span>ساخت فرم جدید</a></li>
        </ul>
    </div>
    <div class="tahlilgar-main-content">
        <div class="tahlilgar-header">
            <h1>ساخت فرم جدید</h1>
        </div>
        <div class="tahlilgar-card">
            <input type="text" id="form-title" class="form-title-input" placeholder="عنوان فرم را اینجا وارد کنید...">
            <div id="form-builder-container"></div>
            <button id="save-form-button" class="tahlilgar-button primary">
                <span class="dashicons dashicons-saved"></span>
                ذخیره فرم
            </button>
            <div id="form-builder-status" style="margin-top: 15px;"></div>
        </div>
    </div>
</div>

<?php
get_footer();
?>