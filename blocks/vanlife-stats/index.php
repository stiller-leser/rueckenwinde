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

$distance = isset($attributes['distance']) ? $attributes['distance'] : '2065 KM';
$days = isset($attributes['days']) ? $attributes['days'] : '34 Tage';
$difficulty = isset($attributes['difficulty']) ? $attributes['difficulty'] : 'Easy';
$budget = isset($attributes['budget']) ? $attributes['budget'] : '€€€';

// Generate unique ID for anchor support
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'vanlife-stats-' . uniqid();
?>

<div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-vanlife-stats">
    <div class="row vanlife-stats grid-x">
        <div class="cell col-6 col-md-3 vanlife-stat">
            <div class="stat-content">
                <span class="stat-label">Distanz:</span>
                <span class="stat-value"><?php echo nl2br(wp_kses_post($distance)); ?></span>
            </div>
        </div>
        
        <div class="cell col-6 col-md-3 vanlife-stat">
            <div class="stat-content stat-separator-left">
                <span class="stat-label">Tage:</span>
                <span class="stat-value"><?php echo nl2br(wp_kses_post($days)); ?></span>
            </div>
        </div>
        
        <div class="cell col-6 col-md-3 vanlife-stat">
            <div class="stat-content stat-separator-left">
                <span class="stat-label">Vanlife-Faktor:</span>
                <span class="stat-value"><?php echo nl2br(wp_kses_post($difficulty)); ?></span>
            </div>
        </div>
        
        <div class="cell col-6 col-md-3 vanlife-stat">
            <div class="stat-content stat-separator-left">
                <span class="stat-label">Budget:</span>
                <span class="stat-value"><?php echo nl2br(wp_kses_post($budget)); ?></span>
            </div>
        </div>
    </div>
</div>
