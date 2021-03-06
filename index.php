<?php
/**
 * Index.php
 *
 * @package Quotidiano
 * @author Jacob Martella
 * @version 1.2
 */
?>
<?php get_header(); ?>

	<div id="content">

        <header class="page-home-header">
            <?php if ( has_header_video() ) { ?>
                <div class="header-video-container">
            <?php } ?>
            <?php the_custom_header_markup(); ?>
            <?php if ( has_header_video() ) { ?>
                </div>
            <?php } ?>
            <div class="page-header-text-outer">
                <div class="page-header-text-inner">
                    <h1 class="page-header-title"><?php echo get_bloginfo( 'name' ); ?></h1>
                    <h3 class="page-header-description"><?php echo get_bloginfo( 'description' ); ?></h3>
                </div>
            </div>
        </header>
        <section class="social-media">
            <?php echo quotidiano_social_media_links(); ?>
        </section>

        <main ui-view>

        </main>

	</div> <!-- end #content -->

<?php get_footer(); ?>