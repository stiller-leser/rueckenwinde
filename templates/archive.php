<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package rueckenwin.de
 */

get_rueckenwinde_header("frontpage", "category");

$catID = get_the_category();
if(isset($catID[0])):
    $category_description = category_description( $catID[0] ); 
else:
    $category_description = category_description( $catID ); 
endif;
$category_title = single_cat_title( $prefix = '', $display = false ); 

function get_top_level_category($post_id) {
    // Get categories for the post
    $categories = get_the_category($post_id);
    
    if (empty($categories) || is_wp_error($categories)) {
        return null; // No categories or an error occurred
    }

    // Take the first category assigned to the post
    $category = $categories[0];

    // Traverse up to the top-level category
    while ($category->parent != 0) {
        $category = get_category($category->parent);
    }

    return $category; // Return the top-level category
}

// Usage
$post_id = get_the_ID(); // Or provide a specific post ID
$top_level_category = get_top_level_category($post_id);
?>

<?php if (function_exists('z_taxonomy_image_url')): ?>
    <style>
        #header-wrap {
            background-image: url('<?php echo esc_url(z_taxonomy_image_url($top_level_category->term_id)); ?>');
            background-size: cover;

        }
    </style>
<?php endif; ?>

    <div id="primary" class="content-area large-8 medium-8 small-12 cell fp-blog-grid">
        <main id="main" class="site-main">
            <?php
                $category = get_queried_object();
                if ( $category && !empty($category->description) ) :
            ?>
                    <section class="category-description">
                        <div class="category-content">
                            <h1>
                                <?php esc_html_e($category_title); ?> 
                            </h1>
                            <?php   
                                // Bild anzeigen falls vorhanden
                                if (function_exists('z_taxonomy_image')) {
                                    z_taxonomy_image();
                                }
                                
                                // NEUE BLOCK-UNTERSTÜTZUNG
                                $description = $category->description;
                                
                                // Prüfen ob es Gutenberg Blocks sind
                                if (has_blocks($description)) {
                                    // Als Blocks rendern
                                    echo do_blocks($description);
                                } else {
                                    // Fallback: Legacy Pseudo-HTML Support
                                    $description = esc_html($description); 
                                    $description = preg_replace_callback('/\\\\(.*?)\\\\/', function($matches) {
                                        return '<' . $matches[1] . '>';
                                    }, $description);
                                    echo wpautop($description);
                                }
                            ?>
                        </div>
                    </section>
            <?php
                endif;

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
                    get_rueckenwinde_part( 'none' );
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