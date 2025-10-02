<?php
/**
 * Template for the Tahlilgar Analyzer Dashboard page.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

get_header(); // Or a custom header if you have one for the plugin pages
?>

<div class="tahlilgar-container">
    <div class="tahlilgar-sidebar">
        <div class="logo">
            <a href="#">تحلیلگر</a>
        </div>
        <ul class="tahlilgar-menu">
            <li class="active"><a href="<?php echo esc_url( ta_get_dashboard_url() ); ?>"><span class="dashicons dashicons-dashboard"></span>داشبورد</a></li>
            <li><a href="<?php echo esc_url( ta_get_form_management_url() ); ?>"><span class="dashicons dashicons-forms"></span>مدیریت فرم‌ها</a></li>
            <li><a href="<?php echo esc_url( ta_get_form_builder_url() ); ?>"><span class="dashicons dashicons-plus-alt"></span>ساخت فرم جدید</a></li>
            <!-- Add other menu items here -->
        </ul>
    </div>
    <div class="tahlilgar-main-content">
        <div class="tahlilgar-header">
            <h1>داشبورد اصلی</h1>
        </div>
        <div class="tahlilgar-card">
            <h2>خوش آمدید!</h2>
            <p>به پنل مدیریت افزونه تحلیلگر خوش آمدید. از منوی سمت راست برای مدیریت فرم‌ها و مشاهده نتایج استفاده کنید.</p>
        </div>
        <!-- More dashboard widgets can go here -->
    </div>
</div>

<?php
get_footer(); // Or a custom footer
?>