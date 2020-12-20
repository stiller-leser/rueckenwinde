<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package rueckenwin.de
 */

$object = get_queried_object();
$slug = 'homepage';
if( !isset($object->slug) ):
    if( isset($object->rewrite['slug']) ):
        $slug = $object->rewrite['slug'];
    endif;
else:
    $slug = $object->slug;
endif;
get_rueckenwinde_header($slug);

// echo '<pre dir="ltr">';
//   print_r($GLOBALS['wp_query']);
// echo '</pre>';
?>

    <div id="primary" class="content-area large-8 medium-8 small-12 cell fp-blog-grid">
        <main id="main" class="site-main">

            <?php
                if ( have_posts() ):
                    /* Start the Loop */
                    while ( have_posts() ) :
                        the_post();
                        /*
                            * Include the Post-Type-specific template for the content.
                            * If you want to override this in a child theme, then include a file
                            * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                        */
                        get_rueckenwinde_part( 'content-excerpt' );
                    endwhile;
                    the_posts_pagination();
                else :
                    get_template_part( 'template-parts/content', 'none' );
                endif;
            ?>
        </main><!-- #main -->
    </div><!-- #primary -->
<?php
get_sidebar();
?>
</section>
<?php
get_footer();
