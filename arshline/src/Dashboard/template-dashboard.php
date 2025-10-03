<?php
/**
 * Template for the Arshline Dashboard page.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

get_header();

// Get page URLs dynamically for robustness
$dashboard_url = get_permalink(get_page_by_path('dashboard'));
$forms_url = get_permalink(get_page_by_path('form-management'));
$builder_url = get_permalink(get_page_by_path('form-builder'));
$settings_url = get_permalink(get_page_by_path('settings'));

?>

<div class="arshline-container">
    <div class="arshline-sidebar">
        <div class="logo">
            <a href="<?php echo esc_url($dashboard_url); ?>">عرشلاین</a>
        </div>
        <ul class="arshline-menu">
            <li class="<?php echo is_page('dashboard') ? 'active' : ''; ?>"><a href="<?php echo esc_url($dashboard_url); ?>"><span class="dashicons dashicons-dashboard"></span>داشبورد</a></li>
            <li class="<?php echo is_page('form-management') ? 'active' : ''; ?>"><a href="<?php echo esc_url($forms_url); ?>"><span class="dashicons dashicons-forms"></span>مدیریت فرم‌ها</a></li>
            <li class="<?php echo is_page('form-builder') ? 'active' : ''; ?>"><a href="<?php echo esc_url($builder_url); ?>"><span class="dashicons dashicons-plus-alt"></span>ساخت فرم جدید</a></li>
            <li class="<?php echo is_page('settings') ? 'active' : ''; ?>"><a href="<?php echo esc_url($settings_url); ?>"><span class="dashicons dashicons-admin-settings"></span>تنظیمات</a></li>
        </ul>
    </div>
    <div class="arshline-main-content">
        <div class="arshline-header">
            <h1>داشبورد اصلی</h1>
        </div>
        <div class="arshline-card">
            <h2>خوش آمدید!</h2>
            <p>به پنل مدیریت افزونه عرشلاین خوش آمدید. از منوی سمت راست برای مدیریت فرم‌ها و سایر بخش‌ها استفاده کنید.</p>
        </div>
    </div>
</div>

<?php
get_footer();
?>