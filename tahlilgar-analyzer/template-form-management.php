<?php
/**
 * Template for the Tahlilgar Analyzer Form Management page.
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
            <li class="active"><a href="<?php echo esc_url( ta_get_form_management_url() ); ?>"><span class="dashicons dashicons-forms"></span>مدیریت فرم‌ها</a></li>
            <li><a href="<?php echo esc_url( ta_get_form_builder_url() ); ?>"><span class="dashicons dashicons-plus-alt"></span>ساخت فرم جدید</a></li>
        </ul>
    </div>
    <div class="tahlilgar-main-content">
        <div class="tahlilgar-header">
            <h1>مدیریت فرم‌ها</h1>
            <a href="<?php echo esc_url( ta_get_form_builder_url() ); ?>" class="tahlilgar-button primary">
                <span class="dashicons dashicons-plus"></span>
                فرم جدید
            </a>
        </div>
        <div class="tahlilgar-card">
            <div id="loading-message">در حال بارگذاری فرم‌ها...</div>
            <div id="no-forms-message" style="display: none;">هیچ فرمی یافت نشد.</div>
            <table id="forms-table" class="tahlilgar-table" style="display: none;">
                <thead>
                    <tr>
                        <th>عنوان فرم</th>
                        <th>شورت‌کد</th>
                        <th>تعداد پاسخ‌ها</th>
                        <th>تاریخ ایجاد</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody id="forms-table-body">
                    <!-- Form rows will be inserted here by JavaScript -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php
get_footer();
?>