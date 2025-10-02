<?php
/**
 * Tahlilgar Analyzer Core Functions
 *
 * General functions available on both the front-end and admin.
 *
 * @package TahlilgarAnalyzer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get the URL for the dashboard page.
 *
 * @return string
 */
function ta_get_dashboard_url() {
	$page = get_page_by_path( 'dashboard' );
	return $page ? get_permalink( $page ) : home_url();
}

/**
 * Get the URL for the form builder page.
 *
 * @return string
 */
function ta_get_form_builder_url() {
	$page = get_page_by_path( 'form-builder' );
	return $page ? get_permalink( $page ) : home_url();
}

/**
 * Get the URL for the form management page.
 *
 * @return string
 */
function ta_get_form_management_url() {
	$page = get_page_by_path( 'form-management' );
	return $page ? get_permalink( $page ) : home_url();
}

/**
 * Get the URL for the results page for a specific form.
 *
 * @param int $form_id The ID of the form.
 * @return string
 */
function ta_get_results_url( $form_id = 0 ) {
	$page = get_page_by_path( 'results' );
	if ( ! $page ) {
		return home_url();
	}

	$url = get_permalink( $page );

	if ( $form_id ) {
		$url = add_query_arg( 'form_id', $form_id, $url );
	}

	return $url;
}