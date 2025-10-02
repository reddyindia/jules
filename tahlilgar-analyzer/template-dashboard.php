<?php
/**
 * Template Name: Dashboard Template
 *
 * This template provides a modern, animated dashboard layout with a collapsible sidebar
 * and a day/night theme switcher.
 */

// Redirect to login page if user is not logged in
if ( ! is_user_logged_in() ) {
    $login_page_url = get_permalink( get_page_by_path( 'login' ) );
    if ( $login_page_url ) {
        wp_redirect( $login_page_url );
        exit;
    }
}

// We don't want the default theme header and footer for this full-screen dashboard.
// We'll manually add the necessary head/foot hooks.
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); // Crucial for loading styles, scripts, and admin bar ?>
</head>
<body <?php body_class('dashboard-body'); ?>>

    <div id="dashboard-container">
        <!-- Collapsible Sidebar -->
        <nav id="dashboard-sidebar" class="sidebar">
            <div class="sidebar-header">
                <h2 class="brand-logo">تحلیلگر</h2>
                <button id="sidebar-toggle-close" class="sidebar-toggle-btn">&times;</button>
            </div>
            <ul class="sidebar-menu">
                <li class="menu-item active"><a href="#">
                    <span class="icon">📊</span><span class="text">داشبورد</span>
                </a></li>
                <li class="menu-item"><a href="#">
                    <span class="icon">📈</span><span class="text">آمارها</span>
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

        <!-- Main Content -->
        <main id="main-content">
            <header class="main-header">
                <div class="header-left">
                    <button id="sidebar-toggle-open" class="sidebar-toggle-btn">☰</button>
                </div>
                <div class="header-right">
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
                <h1>خوش آمدید!</h1>
                <p>اینجا داشبورد تحلیلگر شماست. از منو برای ناوبری استفاده کنید.</p>
                <!-- Add more widgets and content here -->
            </div>
        </main>
    </div>

    <?php wp_footer(); // Crucial for loading footer scripts ?>
</body>
</html>