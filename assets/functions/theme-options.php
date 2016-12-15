<?php
/**
 * Theme-options.php
 *
 * Theme options file, using the Customizer, for Fotographia
 *
 * @author Jacob Martella
 * @package Quotidiano
 * @version 1.0
 */

//* Create the general settings section
function theme_slug_general_customizer( $wp_customize ) {
	$wp_customize->add_section(
		'general',
		array(
			'title' => __('Theme Settings', 'theme-slug'),
			'description' => __('These are the theme options.', 'theme-slug'),
			'priority' => 35,
		)
	);

	//* Facebook Link
	$wp_customize->add_setting(
		'quotidiano-facebook',
		array(
			'default' => '',
			'sanitize_callback' => 'quotidiano_sanitize_link',
		)
	);

	$wp_customize->add_control(
		'quotidiano-facebook',
		array(
			'label' => __('Link to Facebook Profile/Page', 'quotidiano'),
			'section' => 'general',
			'type' => 'text',
		)
	);

    //* Twitter Link
    $wp_customize->add_setting(
        'quotidiano-twitter',
        array(
            'default' => '',
            'sanitize_callback' => 'quotidiano_sanitize_link',
        )
    );

    $wp_customize->add_control(
        'quotidiano-twitter',
        array(
            'label' => __('Link to Twitter Profile', 'quotidiano'),
            'section' => 'general',
            'type' => 'text',
        )
    );

    //* Instagram Link
    $wp_customize->add_setting(
        'quotidiano-instagram',
        array(
            'default' => '',
            'sanitize_callback' => 'quotidiano_sanitize_link',
        )
    );

    $wp_customize->add_control(
        'quotidiano-instagram',
        array(
            'label' => __('Link to Instagram Profile', 'quotidiano'),
            'section' => 'general',
            'type' => 'text',
        )
    );

    //* Tubmlr Link
    $wp_customize->add_setting(
        'quotidiano-tumblr',
        array(
            'default' => '',
            'sanitize_callback' => 'quotidiano_sanitize_link',
        )
    );

    $wp_customize->add_control(
        'quotidiano-tumblr',
        array(
            'label' => __('Link to Tumblr Blog', 'quotidiano'),
            'section' => 'general',
            'type' => 'text',
        )
    );

    //* YouTube Link
    $wp_customize->add_setting(
        'quotidiano-youtube',
        array(
            'default' => '',
            'sanitize_callback' => 'quotidiano_sanitize_link',
        )
    );

    $wp_customize->add_control(
        'quotidiano-youtube',
        array(
            'label' => __('Link to YouTube Page', 'quotidiano'),
            'section' => 'general',
            'type' => 'text',
        )
    );

    //* Pinterest Link
    $wp_customize->add_setting(
        'quotidiano-pinterest',
        array(
            'default' => '',
            'sanitize_callback' => 'quotidiano_sanitize_link',
        )
    );

    $wp_customize->add_control(
        'quotidiano-pinterest',
        array(
            'label' => __('Link to Pinterest Profile', 'quotidiano'),
            'section' => 'general',
            'type' => 'text',
        )
    );

    //* Google+ Link
    $wp_customize->add_setting(
        'quotidiano-google-plus',
        array(
            'default' => '',
            'sanitize_callback' => 'quotidiano_sanitize_link',
        )
    );

    $wp_customize->add_control(
        'quotidiano-google-plus',
        array(
            'label' => __('Link to Google+ Profile', 'quotidiano'),
            'section' => 'general',
            'type' => 'text',
        )
    );

    //* Instagram Link
    $wp_customize->add_setting(
        'quotidiano-linkedin',
        array(
            'default' => '',
            'sanitize_callback' => 'quotidiano_sanitize_link',
        )
    );

    $wp_customize->add_control(
        'quotidiano-linkedin',
        array(
            'label' => __('Link to LinkedIn Profile', 'quotidiano'),
            'section' => 'general',
            'type' => 'text',
        )
    );

}
add_action( 'customize_register', 'theme_slug_general_customizer' );


//* Sanitize Links
function quotidiano_sanitize_link($input) {
	return esc_url_raw( $input );
}

//* Sanitize Layout Option
function theme_slug_sanitize_select( $input, $setting ) {
	$input = sanitize_key( $input );
	$choices = $setting->manager->get_control( $setting->id )->choices;
	return ( array_key_exists( $input, $choices ) ? $input : $setting->default );
}

//* Sanitize Checkboxes
function theme_slug_sanitize_checkbox( $input ) {
	return ( ( isset( $input ) && true == $input ) ? 1 : 0 );
}

//* Sanitize Category Options
function theme_slug_sanitize_category( $input, $setting ) {
	$input = sanitize_key( $input );
	$choices = $setting->manager->get_control( $setting->id )->choices;
	return ( array_key_exists( $input, $choices ) ? $input : $setting->default );
}

//* Sanitize Numbers
function theme_slug_sanitize_num($input, $setting) {
	$number = absint( $input );
	return ( $input ? $input : $setting->default );
}

//* Sanitize Text
function theme_slug_sanitize_text($input) {
	return wp_filter_nohtml_kses( $input );
}
?>