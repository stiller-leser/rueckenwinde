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

// Get attributes with defaults
$title = isset($attributes['title']) ? wp_kses_post($attributes['title']) : '';
$image_src = isset($attributes['imageSrc']) ? $attributes['imageSrc'] : '';
$image_alt = isset($attributes['imageAlt']) ? $attributes['imageAlt'] : 'Uruguay Bild';
$distance = isset($attributes['distance']) ? $attributes['distance'] : '2065 KM';
$days = isset($attributes['days']) ? $attributes['days'] : '34 Tage';
$difficulty = isset($attributes['difficulty']) ? $attributes['difficulty'] : 'Easy';
$budget = isset($attributes['budget']) ? $attributes['budget'] : '€€€';

// Generate unique ID for anchor support
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'country-hero-' . uniqid();
?>

<div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-country-hero">
    <div class="country-hero-container">
        <?php if (!empty($title)) : ?>
            <p class="country-hero-title">
                <?php echo $title; ?>
            </p>
        <?php endif; ?>

        <?php if (!empty($image_src)) : ?>
            <div class="country-hero-image-wrapper mb-4">
                <div class="country-hero-image-placeholder">
                    <img src="<?php echo esc_url($image_src); ?>" 
                         alt="<?php echo esc_attr($image_alt); ?>" 
                         class="img-fluid w-100">
                </div>
            </div>
        <?php else : ?>
            <div class="country-hero-image-wrapper mb-4">
                <div class="country-hero-image-placeholder">
                    <span>BILD</span>
                </div>
            </div>
        <?php endif; ?>

        <div class="row country-hero-stats g-0">
            <div class="col-6 col-md-3 country-hero-stat">
                <div class="stat-content">
                    <span class="stat-label">Distanz:</span>
                    <span class="stat-value"><?php echo esc_html($distance); ?></span>
                </div>
            </div>
            
            <div class="col-6 col-md-3 country-hero-stat">
                <div class="stat-content stat-separator-left">
                    <span class="stat-label">Tage:</span>
                    <span class="stat-value"><?php echo esc_html($days); ?></span>
                </div>
            </div>
            
            <div class="col-6 col-md-3 country-hero-stat">
                <div class="stat-content stat-separator-left">
                    <span class="stat-label">Vanlife-Faktor:</span>
                    <span class="stat-value"><?php echo esc_html($difficulty); ?></span>
                </div>
            </div>
            
            <div class="col-6 col-md-3 country-hero-stat">
                <div class="stat-content stat-separator-left">
                    <span class="stat-label">Budget:</span>
                    <span class="stat-value"><?php echo esc_html($budget); ?></span>
                </div>
            </div>
        </div>
    </div>
</div>