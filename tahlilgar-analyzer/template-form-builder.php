<?php
/**
 * Template Name: Form Builder Template
 *
 * This template provides the layout for the drag-and-drop form builder.
 */

// Redirect to login page if user is not logged in
if ( ! is_user_logged_in() ) {
    $login_page_url = get_permalink( get_page_by_path( 'login' ) );
    if ( $login_page_url ) {
        wp_redirect( $login_page_url );
        exit;
    }
}

// We don't want the default theme header and footer for this full-screen layout.
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); // Crucial for loading styles, scripts, and admin bar ?>
</head>
<body <?php body_class('dashboard-body'); // Reuse dashboard styles for consistency ?>>

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
                <li class="menu-item active"><a href="#">
                    <span class="icon">📝</span><span class="text">فرم‌ساز</span>
                </a></li>
                <li class="menu-item"><a href="<?php echo get_permalink( get_page_by_path( 'form-management' ) ); ?>">
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

        <!-- Main Content for Form Builder -->
        <main id="main-content">
            <div class="form-builder-main-panel">
                <div class="form-builder-top-toolbar">
                    <div class="toolbar-left">
                        <input type="text" id="form-title-input" placeholder="فرم بدون عنوان" class="form-title-input">
                    </div>
                    <div class="toolbar-right">
                        <button id="preview-form-btn" class="button">پیش‌نمایش</button>
                        <button id="save-form-btn" class="button-primary">ذخیره</button>
                    </div>
                </div>
                <div class="form-builder-canvas-container">
                    <div id="form-builder-wrap">
                        <!-- The formBuilder instance will be rendered here -->
                    </div>
                </div>
            </div>
        </main>
    </div>

    <?php wp_footer(); // Crucial for loading footer scripts ?>
</body>
</html>