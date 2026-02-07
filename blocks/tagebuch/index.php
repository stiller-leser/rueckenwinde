<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$heading = isset($attributes['heading']) ? wp_kses_post($attributes['heading']) : '';
$body = isset($attributes['body']) ? wp_kses_post($attributes['body']) : '';
$link_label = isset($attributes['linkLabel']) ? wp_kses_post($attributes['linkLabel']) : '';
$link_url = isset($attributes['linkUrl']) ? $attributes['linkUrl'] : '';
$image_src = isset($attributes['imageSrc']) ? $attributes['imageSrc'] : '';
$image_alt = isset($attributes['imageAlt']) ? $attributes['imageAlt'] : 'Tagebuch Bild';

// Generate unique ID for anchor support
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'tagebuch-' . uniqid();
?>

<div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-tagebuch">
    <div class="row tagebuch-grid grid-x">
        <div class="cell small-12 large-6 tagebuch-text">
            <?php if (!empty($heading)) : ?>
                <h3 class="tagebuch-heading"><?php echo nl2br(wp_kses_post($heading)); ?></h3>
            <?php endif; ?>

            <?php if (!empty($body)) : ?>
                <div class="tagebuch-body">
                    <?php echo nl2br(wp_kses_post($body)); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($link_label)) : ?>
                <div class="tagebuch-link">
                    <?php if (!empty($link_url)) : ?>
                        <a href="<?php echo esc_url($link_url); ?>"><?php echo nl2br(wp_kses_post($link_label)); ?></a>
                    <?php else : ?>
                        <span><?php echo nl2br(wp_kses_post($link_label)); ?></span>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>

        <div class="cell small-12 large-6 tagebuch-image">
            <?php if (!empty($image_src)) : ?>
                <img src="<?php echo esc_url($image_src); ?>" alt="<?php echo esc_attr($image_alt); ?>">
            <?php else : ?>
                <div class="tagebuch-image-placeholder">BILD</div>
            <?php endif; ?>
        </div>
    </div>
</div>
