document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('dashboard-sidebar');
    const openSidebarBtn = document.getElementById('sidebar-toggle-open');
    const closeSidebarBtn = document.getElementById('sidebar-toggle-close');
    const themeSwitch = document.getElementById('theme-switch-checkbox');
    const body = document.body;

    // --- Sidebar Toggle Logic ---
    function toggleSidebar() {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
        } else {
            sidebar.classList.toggle('collapsed');
            // You might want to adjust the main content margin here if needed
        }
    }

    if (openSidebarBtn) {
        openSidebarBtn.addEventListener('click', toggleSidebar);
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', toggleSidebar);
    }

    // Close sidebar if clicking outside of it on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnOpenButton = openSidebarBtn.contains(event.target);
            if (!isClickInsideSidebar && !isClickOnOpenButton) {
                sidebar.classList.remove('open');
            }
        }
    });


    // --- Theme Switcher Logic ---
    const THEME_KEY = 'tahlilgar_dashboard_theme';

    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            if(themeSwitch) themeSwitch.checked = false; // In our CSS, unchecked is dark
        } else {
            body.classList.remove('dark-theme');
            if(themeSwitch) themeSwitch.checked = true; // Checked is light
        }
    }

    // Function to handle the switch change
    function handleThemeChange() {
        const newTheme = themeSwitch.checked ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    }

    // Set initial theme on page load
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light'; // Default to light theme
    applyTheme(savedTheme);


    if (themeSwitch) {
        themeSwitch.addEventListener('change', handleThemeChange);
    }
});