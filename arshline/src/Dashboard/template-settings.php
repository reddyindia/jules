<?php
/**
 * Template Name: Arshline Settings
 * This template provides the settings page for the Arshline plugin.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

get_header();

// Get page URLs dynamically
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
            <h1>تنظیمات</h1>
        </div>
        <div class="arshline-card">
            <h2 class="nav-tab-wrapper">
                <a href="#ai-settings" class="nav-tab nav-tab-active">هوش مصنوعی</a>
                <a href="#general-settings" class="nav-tab">عمومی (به زودی)</a>
            </h2>

            <div id="ai-settings" class="settings-tab-content active">
                <h3>تنظیمات اتصال به هوش مصنوعی</h3>
                <p>برای استفاده از قابلیت‌های هوشمند، اطلاعات اتصال به API را وارد کنید.</p>
                <form id="ai-settings-form">
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="ai_base_url">Base URL</label>
                                </th>
                                <td>
                                    <input type="url" id="ai_base_url" name="ai_base_url" class="regular-text" placeholder="https://api.openai.com/v1">
                                    <p class="description">آدرس پایه API. برای OpenAI، این آدرس را خالی بگذارید.</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="ai_api_key">API Key</label>
                                </th>
                                <td>
                                    <input type="password" id="ai_api_key" name="ai_api_key" class="regular-text">
                                    <p class="description">کلید API خود را برای احراز هویت وارد کنید.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="submit">
                        <button type="submit" class="button button-primary">ذخیره تنظیمات</button>
                        <span id="ai-settings-status" style="margin-right: 10px;"></span>
                    </p>
                </form>
            </div>

            <div id="general-settings" class="settings-tab-content" style="display: none;">
                <h3>تنظیمات عمومی</h3>
                <p>این بخش در فازهای آینده تکمیل خواهد شد.</p>
            </div>
        </div>
    </div>
</div>

<?php
get_footer();
?>