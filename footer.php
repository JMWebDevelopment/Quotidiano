<?php
/**
 * Footer.php
 *
 * @package Quotidiano
 * @author Jacob Martella
 * @version 1.2
 */
?>
					<footer class="footer" role="contentinfo">
						<div id="inner-footer" class="row">
                            <p class="source-org copyright">&copy; <?php _e( 'Copyright', 'quotidiano' ); ?> <?php echo date('Y'); ?> <span class="hide-for-small-only">&bull;</span><span class="show-for-small-only"><br /></span> <a href="<?php echo esc_url( get_home_url( '/' ) ); ?>"><?php bloginfo('name'); ?></a> <span class="hide-for-small-only">&bull;</span><span class="show-for-small-only"><br /></span> <a href="http://www.jacobmartella.com/wordpress/wordpress-theme/quotidiano-wordpress-theme">Quotidiano Theme</a></p>
						</div> <!-- end #inner-footer -->
					</footer> <!-- end .footer -->
				</div>  <!-- end .main-content -->
			</div> <!-- end .off-canvas-wrapper-inner -->
		</div> <!-- end .off-canvas-wrapper -->
		<?php wp_footer(); ?>
	</body>
</html> <!-- end page -->