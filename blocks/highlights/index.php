<?php
/**
 * Highlights Hero Block - Server Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$heading = isset($attributes['heading']) ? $attributes['heading'] : 'UNSERE HIGHLIGHTS';

$image1_src = isset($attributes['image1Src']) ? $attributes['image1Src'] : '';
$image1_alt = isset($attributes['image1Alt']) ? $attributes['image1Alt'] : 'Highlight 1';

$image2_src = isset($attributes['image2Src']) ? $attributes['image2Src'] : '';
$image2_alt = isset($attributes['image2Alt']) ? $attributes['image2Alt'] : 'Highlight 2';

$image3_src = isset($attributes['image3Src']) ? $attributes['image3Src'] : '';
$image3_alt = isset($attributes['image3Alt']) ? $attributes['image3Alt'] : 'Highlight 3';

$link_text = isset($attributes['linkText']) ? $attributes['linkText'] : '>>WEITERLESEN [LINK]';
$link_url = isset($attributes['linkUrl']) ? $attributes['linkUrl'] : '';

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'highlights-hero-' . uniqid();
?>

<div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-highlights-hero">
    <div class="highlights-hero-container">
        
        <h2 class="highlights-hero-heading">
            <?php echo esc_html($heading); ?>
        </h2>

        <div class="row highlights-hero-images grid-x">
            
            <!-- Image 1 -->
            <div class="cell large-4 columns">
                <div class="highlights-hero-image-wrapper">
                    <?php if (!empty($image1_src)) : ?>
                        <img src="<?php echo esc_url($image1_src); ?>" 
                             alt="<?php echo esc_attr($image1_alt); ?>" 
                             class="highlights-hero-image">
                    <?php else : ?>
                        <div class="highlights-hero-image-placeholder">
                            <span>BILD</span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Image 2 -->
            <div class="cell large-4 columns">
                <div class="highlights-hero-image-wrapper">
                    <?php if (!empty($image2_src)) : ?>
                        <img src="<?php echo esc_url($image2_src); ?>" 
                             alt="<?php echo esc_attr($image2_alt); ?>" 
                             class="highlights-hero-image">
                    <?php else : ?>
                        <div class="highlights-hero-image-placeholder">
                            <span>BILD</span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Image 3 -->
            <div class="cell large-4 columns">
                <div class="highlights-hero-image-wrapper">
                    <?php if (!empty($image3_src)) : ?>
                        <img src="<?php echo esc_url($image3_src); ?>" 
                             alt="<?php echo esc_attr($image3_alt); ?>" 
                             class="highlights-hero-image">
                    <?php else : ?>
                        <div class="highlights-hero-image-placeholder">
                            <span>BILD</span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

        </div>

        <!-- Link -->
        <?php if (!empty($link_url)) : ?>
            <a href="<?php echo esc_url($link_url); ?>" class="highlights-hero-link">
                <?php echo esc_html($link_text); ?>
            </a>
        <?php endif; ?>

    </div>
</div>
