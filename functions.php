<?php
/**
 * functions.php
 *
 * @package **Theme Name**
 * @author Jacob Martella
 * @version 1.0
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
	wp_enqueue_script( 'angularjs', get_stylesheet_directory_uri() . '/bower_components/angular/angular.js' );
	wp_enqueue_script( 'angularjs-route', get_stylesheet_directory_uri() . '/bower_components/angular-route/angular-route.min.js' );
	wp_enqueue_script( 'angularjs-ui-route', get_stylesheet_directory_uri() . '/bower_components/angular-ui/angular-ui-router.min.js' );
    wp_enqueue_script( 'angularjs-ui-resource', get_stylesheet_directory_uri() . '/bower_components/angular/angular-resource.min.js' );

	// Adding scripts file in the footer
	if ( is_user_logged_in() ) {
		$user = wp_get_current_user();
	} else {
		$user = '';
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
        'months'                => quotidiano_get_months(),
        'translations'          => [
            'page_404_title'    => __( 'Post or Page Not Found!', 'quotidiano' ),
            'page_404_content'  => __( 'The post or page you are looking for isn\'t here . Please return to the < a href = "/" > homepage</a >', 'quotidiano' ),
            'archive_previous'  => __( '<<Previous Posts', 'quotidiano'),
            'archive_next'      => __( 'Next Posts>>', 'quotidiano'),
            'reply'             => __( 'Reply', 'quotidiano'),
            'no_comments'       => __( 'No Comments on', 'quotidiano' ),
            'comments'          => __( 'Comments', 'quotidiano' ),
            'comment'           => __( 'Comment', 'quotidiano' ),
            'on'                => __( 'On', 'quotidiano' ),
            'add_comment'       => __( 'Add Comment', 'quotidiano' ),
            'required'          => __( 'Required', 'quotidiano' ),
            'your_comment'      => __( 'You\'re comment...', 'quotidiano' ),
            'replying_to'       => __( 'Replying to ', 'quotidiano' ),
            'remove_reply'      => __( 'Remove reply', 'quotidiano' ),
            'written_by'        => __( 'Written by: ', 'quotidiano' ),
            'categories'        => __( 'Categories: ', 'quotidiano' ),
            'tags'              => __( 'Tags: ', 'quotidiano' ),
            'load_more'         => __( 'Load More', 'quotidiano' ),
            'load'              => __( 'Load', 'quotidiano' )
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
	load_theme_textdomain( 'quotidiano', get_template_directory() .'/assets/translation' );

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
 * Register Sidebar
 */
function quotidiano_register_sidebars() {
	register_sidebar(array(
			'id' => 'sidebar1',
			'name' => __('Sidebar', 'quotidiano'),
			'description' => __('The first (primary) sidebar.', 'quotidiano'),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget' => '</div>',
			'before_title' => '<h4 class="widgettitle">',
			'after_title' => '</h4>',
	));
}
add_action( 'widgets_init', 'quotidiano_register_sidebars' );

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
    $html = '';
    

    return $html;
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