<?php
/**
 * functions.php
 *
 * @package Quotidiano
 * @author Jacob Martella
 * @version 1.1
 */
/**
 * Table of Contents
 * I. General Functions
 * II. WP REST API Functions
 * III. Header Functions
 * IV. Home Functions
 * V. Footer Functions
 * VI. Single Post Functions
 * VII. Archive Functions
 * VIII. Author Functions
 * IX. Comments Functions
 * X. Other Functions
 */
/**
 ******************** I. General Functions *********************************
 */
/**
 * Enqueue the necessary scripts
 */
function quotidiano_scripts() {
	global $wp_styles; // Call global $wp_styles variable to add conditional wrapper around ie stylesheet the WordPress way

	// Load What-Input files in footer
	wp_enqueue_script( 'what-input', get_template_directory_uri() . '/vendor/what-input/what-input.min.js', array(), '', true );

	// Adding Foundation scripts file in the footer
	wp_enqueue_script( 'foundation-js', get_template_directory_uri() . '/assets/js/foundation.min.js', array( 'jquery' ), '6.0', true );

	// Add the AngularJS files
	wp_enqueue_script( 'angularjs', get_template_directory_uri() . '/bower_components/angular/angular.js' );
	wp_enqueue_script( 'angularjs-route', get_template_directory_uri() . '/bower_components/angular-route/angular-route.min.js' );
	wp_enqueue_script( 'angularjs-ui-route', get_template_directory_uri() . '/bower_components/angular-ui/angular-ui-router.min.js' );
    wp_enqueue_script( 'angularjs-ui-resource', get_template_directory_uri() . '/bower_components/angular-resource/angular-resource.min.js' );
    wp_enqueue_script( 'angularjs-sanitize', get_template_directory_uri() . '/bower_components/angular-sanitize/angular-sanitize.min.js' );

	// Adding scripts file in the footer
	if ( is_user_logged_in() ) {
		$user = wp_get_current_user();
	} else {
		$user = '';
	}
	$post_classes = get_post_class('', get_the_ID());
	$classes = '';
	foreach ( $post_classes as $post_class ) {
	    $classes = $classes . ' ' . $post_class;
    }
	$args = array(
		'partials' 				=> trailingslashit( get_template_directory_uri() ) . 'partials/',
		'api_url' 				=> rest_get_url_prefix() . '/wp/v2/',
		'template_directory' 	=> get_stylesheet_directory_uri() . '/',
		'nonce' 				=> wp_create_nonce( 'wp_rest' ),
		'is_admin' 				=> current_user_can( 'administrator' ),
        'site_url'              => home_url( '/' ),
		'site_title' 			=> get_bloginfo( 'name' ),
		'site_description' 		=> get_bloginfo( 'description' ),
		'logged_in' 			=> is_user_logged_in(),
		'logged_in_user'		=> $user,
        'header_image'          => get_header_image(),
        'months'                => quotidiano_get_months(),
        'social_media_links'    => quotidiano_social_media_rest_api(),
        'post-class'            => $classes,
        'translations'          => [
            'page_404_title'            => __( 'Post or Page Not Found!', 'quotidiano' ),
            'page_404_content_first'    => __( 'The post or page you are looking for isn\'t here. Please return to the', 'quotidiano' ),
            'page_404_homepage'         => __( 'homepage', 'quotidiano' ),
            'page_404_content_second'   => __( 'or use the search form below to find what you\'re looking for.', 'quotidiano' ),
            'reply'                     => __( 'Reply', 'quotidiano'),
            'no_comments'               => __( 'No Comments on', 'quotidiano' ),
            'comments'                  => __( 'Comments', 'quotidiano' ),
            'comment'                   => __( 'Comment', 'quotidiano' ),
            'on'                        => __( 'On', 'quotidiano' ),
            'leave_comment'             => __( 'Leave a Comment', 'quotidiano' ),
            'required'                  => __( 'Required', 'quotidiano' ),
            'your_comment'              => __( 'Your comment...', 'quotidiano' ),
            'add_comment'               => __( 'Leave Your Comment', 'quotidiano' ),
            'replying_to'               => __( 'Replying to ', 'quotidiano' ),
            'remove_reply'              => __( 'Remove reply', 'quotidiano' ),
            'written_by'                => __( 'Written by: ', 'quotidiano' ),
            'filed_under'               => __( 'Filed under: ', 'quotidiano' ),
            'load_more'                 => __( 'Load More', 'quotidiano' ),
            'load'                      => __( 'Load', 'quotidiano' ),
            'posted_at'                 => __( 'Posted at', 'quotidiano' ),
            'comment_success'           => __( 'Thank you for submitting your comment.', 'quotidiano' )
        ]
	);
	wp_enqueue_script( 'quotidiano-site-js', get_template_directory_uri() . '/assets/js/scripts.js', array( 'jquery', 'angularjs', 'angularjs-route' ), '', true );
	wp_localize_script( 'quotidiano-site-js', 'quotidiano', $args );

	//* Register the needed fonts
    wp_enqueue_style( 'roboto', '//fonts.googleapis.com/css?family=Roboto', array(), '', 'all' );
    wp_enqueue_style( 'playfair-display', '//fonts.googleapis.com/css?family=Playfair+Display', array(), '', 'all' );
    wp_enqueue_style( 'cutive', '//fonts.googleapis.com/css?family=Cutive', array(), '', 'all' );

	// Register main stylesheet
	wp_enqueue_style( 'quotidiano-site-css', get_template_directory_uri() . '/style.css', array(), '', 'all' );

	//* Register the color stylesheet if need be
    if ( get_theme_mod( 'quotidiano-color-scheme' ) != 'default' ) {
        $color = get_theme_mod( 'quotidiano-color-scheme' );
        wp_enqueue_style( 'quotidiano-' . $color . '-css', get_template_directory_uri() . '/assets/css/' . $color . '.css', array(), '', 'all' );
    }

	// Comment reply script for threaded comments
	if ( is_singular() AND comments_open() AND (get_option('thread_comments') == 1)) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action('wp_enqueue_scripts', 'quotidiano_scripts', 999);
/**
 * Add in theme supports
 */
function quotidiano_theme_support() {

	//* Add WP Thumbnail Support
	add_theme_support( 'post-thumbnails' );

	//* Default thumbnail size
	set_post_thumbnail_size(125, 125, true);

	//* Add RSS Support
	add_theme_support( 'automatic-feed-links' );

	//* Add Support for WP Controlled Title Tag
	add_theme_support( 'title-tag' );

	//* Add HTML5 Support
	add_theme_support( 'html5',
		array(
			'comment-list',
			'comment-form',
			'search-form',
		)
	);

	//* Add the Editor Stylesheet
	add_editor_style('assets/css/editor-styles.css');

	//* Add support for custom header media
    add_theme_support( 'custom-header', array(
        'video' => true,
        'width'              => 2000,
        'height'             => 781,
        'flex-width'         => true,
        'flex-height'        => true,
    ) );

	//* Add Support for Translation
	load_theme_textdomain( 'quotidiano', get_template_directory() . '/assets/languages' );

	//* Adding post format support
	/* add_theme_support( 'post-formats',
		array(
			'aside',             // title less blurb
			'gallery',           // gallery of images
			'link',              // quick link to other site
			'image',             // an image
			'quote',             // a quick quote
			'status',            // a Facebook like status update
			'video',             // video
			'audio',             // audio
			'chat'               // chat transcript
		)
	); */

    if ( ! isset( $content_width ) ) $content_width = 1000;
}
add_action('after_setup_theme','quotidiano_theme_support', 16);
/**
 * Include theme options
 */
require('assets/functions/theme-options.php');
/**
 * Include custom functions
 */
require('assets/functions/menu-walkers.php');
/**
 ******************** II. WP REST API Functions *********************************
 */
/**
 * Rewrite the search url so that AngularJS can grab it to display results
 */
function search_url_rewrite () {
	if ( is_search() && !empty( $_GET['s'] ) ) {
		wp_redirect( home_url( '/search/' ) . urlencode( get_query_var( 's' ) ) );
		exit();
	}
}
add_action( 'template_redirect', 'search_url_rewrite' );

/**
 * Register the necessary fields to display post information correctly
 */
add_action( 'rest_api_init', 'quotidiano_register_rest_fields' );
function quotidiano_register_rest_fields() {


    register_rest_field( 'post',
        'featured_image',
        array(
            'get_callback'    => 'quotidiano_get_thumbnail_url',
            'update_callback' => null,
            'schema'          => null,
        )
    );

    register_rest_field( 'post',
        'category_name',
        array(
            'get_callback'    => 'quotidiano_get_category_name_from_restapi',
            'update_callback' => null,
            'schema'          => null
        )
    );

    register_rest_field( 'post',
        'tag_name',
        array(
            'get_callback'    => 'quotidiano_get_tag_name_from_restapi',
            'update_callback' => null,
            'schema'          => null
        )
    );

    register_rest_field( 'post',
        'comments',
        array(
            'get_callback' 	  => 'quotidiano_get_comments',
            'update_callback' => null,
            'schema' 		  => null,
    ) );

	register_rest_field( 'post',
		'author_slug',
		array(
			'get_callback' 	  => 'quotidiano_get_author_slug',
			'update_callback' => null,
			'schema' 		  => null,
	) );

}

/**
 * Grabs the URL of the post's featured image to display it on the page
 *
 * @param $post
 *
 * @return bool | string, url to the post's featured image
 */
function quotidiano_get_thumbnail_url( $post ){
    if ( has_post_thumbnail( $post[ 'id' ] ) ) {
        $imgArray = wp_get_attachment_image_src( get_post_thumbnail_id( $post[ 'id' ] ), 'full' );
        $imgURL = $imgArray[ 0 ];
        return $imgURL;
    } else {
        return false;
    }
}

/**
 * Returns the array of categories a post is filed under
 *
 * @param $object
 *
 * @param $field_name
 *
 * @param $request
 *
 * @return array, list of category names for a post
 */
function quotidiano_get_category_name_from_restapi( $object, $field_name, $request ) {
    $cats = [];
    foreach ( $object[ 'categories' ] as $cat ) {
        array_push( $cats, get_cat_name( $cat ) );
    }
    return $cats;
}

/**
 * Returns the array of tags a post has
 *
 * @param $object
 *
 * @param $field_name
 *
 * @param $request
 *
 * @return array, list of tags for a post
 */
function quotidiano_get_tag_name_from_restapi( $object, $field_name, $request ) {
    $tags = [];
    if ( isset( $object[ 'tags' ] ) ) {
        foreach ( $object['tags'] as $tag_id ) {
            $tag = get_tag( $tag_id );
            array_push( $tags, $tag->name );
        }
    }
    return $tags;
}

/**
 * Adds year, month and day parameters to the default collection for the REST API
 *
 * @param $params
 *
 * @return mixed, the new set of parameters for the collection
 */
function quotidiano_rest_post_collection_params( $params ) {
    $params['year'] = array(
        'type'        => 'integer',
        'description' => 'Restrict posts to ones published in a specific year.'
    );
    $params['monthnum'] = array(
        'type'        => 'integer',
        'description' => 'Restrict posts to ones published in a specific month.'
    );
    $params['day'] = array(
        'type'        => 'integer',
        'description' => 'Restrict posts to ones published in a specific day.'
    );
    return $params;
}
add_action( 'rest_post_collection_params', 'quotidiano_rest_post_collection_params' );

/**
 * Adds the year, month and day parameters to the list of query vars for the REST API
 *
 * @param $query_vars
 *
 * @param $request
 *
 * @return mixed, the new set of query vars with the added vars
 */
function quotidiano_rest_post_query ( $query_vars, $request ) {
    if ( $request['year'] ) {
        $query_vars['year'] = $request['year'];
    }
    if ( $request['monthnum'] ) {
        $query_vars['monthnum'] = $request['monthnum'];
    }
    if ( $request['day'] ) {
        $query_vars['day'] = $request['day'];
    }
        return $query_vars;
}
add_filter( 'rest_post_query', 'quotidiano_rest_post_query', 10, 2 );

/**
 * Returns the array of comments for a given post
 *
 * @param $object
 *
 * @param $field_name
 *
 * @param $request
 *
 * @return mixed, list of comments for a post
 */
function quotidiano_get_comments( $object, $field_name, $request ) {

    return get_comments( array( 'post_id' => $object[ 'id' ] ) );

}

/**
 * Returns the slug of an author from the given author id
 *
 * @param $object
 *
 * @param $field_name
 *
 * @param $request
 *
 * @return string, returns the slug of an author from id
 */
function quotidiano_get_author_slug( $object, $field_name, $request ) {
	$id = $object[ 'author' ];
	$user = get_user_by( 'id', $id );
	return $user->user_login;
}

function quotidiano_get_months() {
    $month_num_array = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];
    $month_array = [];

    foreach ( $month_num_array as $month_num ) {
        $month = $GLOBALS['wp_locale']->get_month( $month_num );
        array_push( $month_array, $month );
    }

    return $month_array;
}

function filter_rest_allow_anonymous_comments() {
    if ( get_theme_mod( 'quotidiano-allow-anonymous-comments' ) == 1 ) {
        return true;
    } else {
        return false;
    }
}
add_filter( 'rest_allow_anonymous_comments', 'filter_rest_allow_anonymous_comments' );
/**
 ******************** III. Header Functions *********************************
 */
/**
 * Register Menus
 */
register_nav_menus(
		array(
				'top-nav' 		=> __( 'Top Menu', 'quotidiano' ),   // Main nav in header
		)
);
function quotidiano_social_media_links() {
    $html = '<div class="social-links-inner clearfix">';
    if ( get_theme_mod( 'quotidiano-facebook' ) ) { $html .= '<div id="quotidiano-facebook-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-facebook' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/facebook.png" /></a></div>'; }
    if ( get_theme_mod( 'quotidiano-twitter' ) ) { $html .= '<div id="quotidiano-twitter-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-twitter' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/twitter.png" /></a></div>'; }
    if ( get_theme_mod( 'quotidiano-instagram' ) ) { $html .= '<div id="quotidiano-instagram-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-instagram' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/instagram.png" /></a></div>'; }
    if ( get_theme_mod( 'quotidiano-tumblr' ) ) { $html .= '<div id="quotidiano-tumblr-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-tumblr' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/tumblr.png" /></a></div>'; }
    if ( get_theme_mod( 'quotidiano-youtube' ) ) { $html .= '<div id="quotidiano-youtube-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-youtube' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/youtube.png" /></a></div>'; }
    if ( get_theme_mod( 'quotidiano-pinterest' ) ) { $html .= '<div id="quotidiano-pinterest-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-pinterest' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/pinterest.png" /></a></div>'; }
    if ( get_theme_mod( 'quotidiano-google-plus' ) ) { $html .= '<div id="quotidiano-google-plus-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-google-plus' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/google-plus.png" /></a></div>'; }
    if ( get_theme_mod( 'quotidiano-linkedin' ) ) { $html .= '<div id="quotidiano-linkedin-link" class="quotidiano-social-link"><a href="' . get_theme_mod( 'quotidiano-linkedin' ) . '"><img src=" ' . get_template_directory_uri() . '/assets/images/linkedin.png" /></a></div>'; }
    $html .= '</div>';

    return $html;
}
function quotidiano_social_media_rest_api() {
    $links = [];
    $social_sites = array( 'facebook', 'twitter', 'instagram', 'tumblr', 'youtube', 'pinterest', 'google-plus', 'linkedin' );
    foreach ( $social_sites as $site ) {
        if ( get_theme_mod( 'quotidiano-' . $site ) ) {
            if ( $site == 'google-plus' ) {
                $title = __( 'Google+', 'quotidiano' );
            } else if ( $site == 'youtube' ) {
                $title = __( 'YouTube', 'quotidiano' );
            } else if ( $site == 'linkedin' ) {
                $title = __( 'LinkedIn', 'quotidiano' );
            } else {
                $title = __( ucfirst( $site ), 'quotidiano' );
            }
            $site_array = array(
                'slug'  => $site,
                'link'  => get_theme_mod( 'quotidiano-' . $site ),
                'title' => $title,
                'image' => get_template_directory_uri() . '/assets/images/' . $site . '.png'
            );
            array_push( $links, $site_array );
        }
    }

    return $links;
}
/**
 ******************** IV. Home Functions *********************************
 */
/**
 ******************** V. Footer Functions *********************************
 */
/**
 ******************** VI. Single Post Functions *********************************
 */
/**
 ******************** VII. Archive Functions *********************************
 */
/**
 ******************** VIII. Author Functions *********************************
 */
/**
 ******************** IX. Comments Functions *********************************
 */
/**
 ******************** X. Other Functions *********************************
 */
include_once( 'assets/functions/updater.php' );
if ( is_admin() ) { // note the use of is_admin() to double check that this is happening in the admin
    $config = array(
        'slug'                  => 'quotidiano', // this is the slug of your plugin
        'proper_folder_name'    => 'quotidiano', // this is the name of the folder your plugin lives in
        'api_url'               => 'https://api.github.com/repos/viewfromthebox/quotidiano', // the GitHub API url of your GitHub repo
        'raw_url'               => 'https://raw.github.com/viewfromthebox/quotidiano/master', // the GitHub raw url of your GitHub repo
        'github_url'            => 'https://github.com/viewfromthebox/quotidiano', // the GitHub url of your GitHub repo
        'zip_url'               => 'https://github.com/viewfromthebox/quotidiano/zipball/master', // the zip url of the GitHub repo
        'sslverify'             => true, // whether WP should check the validity of the SSL cert when getting an update, see https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/2 and https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/4 for details
        'requires'              => '4.8', // which version of WordPress does your plugin require?
        'tested'                => '4.8', // which version of WordPress is your plugin tested up to?
        'readme'                => 'README.md', // which file to use as the readme for the version number
        'access_token'          => '', // Access private repositories by authorizing under Appearance > GitHub Updates when this example plugin is installed
    );

    new WP_GitHub_Updater( $config );
}