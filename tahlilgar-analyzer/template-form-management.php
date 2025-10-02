<?php
/**
 * Template Name: Form Management Template
 */

// Redirect to login page if user is not logged in
if ( ! is_user_logged_in() ) {
    wp_redirect( get_permalink( get_page_by_path( 'login' ) ) );
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class('dashboard-body'); ?>>

    <div id="dashboard-container">
        <nav id="dashboard-sidebar" class="sidebar">
            <div class="sidebar-header">
                <h2 class="brand-logo">تحلیلگر</h2>
                <button id="sidebar-toggle-close" class="sidebar-toggle-btn">&times;</button>
            </div>
             <ul class="sidebar-menu">
                <li class="menu-item"><a href="<?php echo get_permalink( get_page_by_path( 'dashboard' ) ); ?>">
                    <span class="icon">📊</span><span class="text">داشبورد</span>
                </a></li>
                <li class="menu-item"><a href="<?php echo get_permalink( get_page_by_path( 'form-builder' ) ); ?>">
                    <span class="icon">📝</span><span class="text">فرم‌ساز</span>
                </a></li>
                <li class="menu-item active"><a href="#">
                    <span class="icon">🗂️</span><span class="text">مدیریت فرم‌ها</span>
                </a></li>
                 <li class="menu-item"><a href="#">
                    <span class="icon">📈</span><span class="text">نتایج</span>
                </a></li>
                <li class="menu-item"><a href="#">
                    <span class="icon">⚙️</span><span class="text">تنظیمات</span>
                </a></li>
                <li class="menu-item"><a href="#">
                    <span class="icon">👤</span><span class="text">پروفایل</span>
                </a></li>
            </ul>
            <div class="sidebar-footer">
                <a href="<?php echo wp_logout_url( get_permalink( get_page_by_path( 'login' ) ) ); ?>" class="logout-link">
                    <span class="icon">🚪</span><span class="text">خروج</span>
                </a>
            </div>
        </nav>

        <main id="main-content">
            <header class="main-header">
                <div class="header-left">
                    <button id="sidebar-toggle-open" class="sidebar-toggle-btn">☰</button>
                    <h1>مدیریت فرم‌ها</h1>
                </div>
                <div class="header-right">
                    <a href="<?php echo get_permalink( get_page_by_path( 'form-builder' ) ); ?>" class="button button-primary" style="font-size: 14px; padding: 5px 15px; height: auto; line-height: 1.5;">ساخت فرم جدید</a>
                    <div class="theme-switcher">
                        <input type="checkbox" id="theme-switch-checkbox" class="theme-switch-checkbox">
                        <label for="theme-switch-checkbox" class="theme-switch-label">
                            <span class="sun">☀️</span>
                            <span class="moon">🌙</span>
                        </label>
                    </div>
                    <div class="user-profile">
                        <span><?php echo esc_html( wp_get_current_user()->display_name ); ?></span>
                        <?php echo get_avatar( get_current_user_id(), 32 ); ?>
                    </div>
                </div>
            </header>
            <div class="content-area">
                <div id="form-management-table">
                    <!-- Form list will be rendered here by JavaScript -->
                    <p>در حال بارگذاری لیست فرم‌ها...</p>
                </div>
            </div>
        </main>
    </div>

    <?php wp_footer(); ?>
</body>
</html>