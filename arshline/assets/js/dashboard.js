jQuery(document).ready(function($) {
    // Simple script to handle active menu item
    const currentPage = window.location.pathname.split('/').pop();
    $('.tahlilgar-menu li a').each(function() {
        const linkPage = $(this).attr('href').split('/').pop();
        if (linkPage === currentPage) {
            $(this).parent('li').addClass('active');
        }
    });

    // Logout functionality (if ever needed)
    // Example: $('#logout-button').on('click', function(e) { ... });
});