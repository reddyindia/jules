<?php
/**
 * Template Name: Login Template
 */

get_header();
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
        <h1><?php _e( 'Login', 'tahlilgar-analyzer' ); ?></h1>
        <?php
        if ( ! is_user_logged_in() ) {
            $dashboard_url = get_permalink( get_page_by_path( 'dashboard' ) );
            $args = array(
                'redirect' => $dashboard_url,
                'form_id' => 'loginform-custom',
            );
            wp_login_form( $args );
        } else {
            $dashboard_url = get_permalink( get_page_by_path( 'dashboard' ) );
            echo '<p>' . __( 'You are already logged in.', 'tahlilgar-analyzer' ) . '</p>';
            echo '<a href="' . $dashboard_url . '">' . __( 'Go to Dashboard', 'tahlilgar-analyzer' ) . '</a>';
            echo ' | ';
            echo '<a href="' . wp_logout_url( get_permalink() ) . '">' . __( 'Log Out', 'tahlilgar-analyzer' ) . '</a>';
        }
        ?>
    </main>
</div>

<?php get_footer(); ?>