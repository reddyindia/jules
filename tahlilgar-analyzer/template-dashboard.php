<?php
/**
 * Template Name: Dashboard Template
 */

if ( ! is_user_logged_in() ) {
    $login_page_url = get_permalink( get_page_by_path( 'login' ) );
    if ( $login_page_url ) {
        wp_redirect( $login_page_url );
        exit;
    }
}

get_header();
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
        <h1><?php _e( 'Dashboard', 'tahlilgar-analyzer' ); ?></h1>
        <p><?php printf( __( 'Welcome to your dashboard, %s.', 'tahlilgar-analyzer' ), wp_get_current_user()->display_name ); ?></p>
        <p><a href="<?php echo wp_logout_url( get_permalink() ); ?>"><?php _e( 'Log Out', 'tahlilgar-analyzer' ); ?></a></p>
    </main>
</div>

<?php get_footer(); ?>