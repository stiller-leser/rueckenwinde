<?php
/**
 * Laendernavigation Block - Server Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$overview_label = isset($attributes['overviewLabel']) ? wp_kses_post($attributes['overviewLabel']) : '';
$overview_url = isset($attributes['overviewUrl']) ? $attributes['overviewUrl'] : '';

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'laendernavigation-' . uniqid();

$next_post = null;
$prev_post = null;

if (is_singular('land')) {
    $next_post = get_adjacent_post(false, '', false);
    $prev_post = get_adjacent_post(false, '', true);
}

$has_next = !empty($next_post);
$has_prev = !empty($prev_post);
$has_overview = !empty($overview_url);

$is_first = !$has_prev;
$show_left = ($is_first && $has_overview) || $has_prev;
$show_right = $has_next;

$right_post = $has_next ? $next_post : null;
$right_prefix = '➡️ ';
$left_post = $has_prev ? $prev_post : null;
$left_prefix = '⬅️ ';
?>

<?php if ($show_left || $show_right) : ?>
    <div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-laendernavigation">
        <div class="laendernavigation">
            <?php if ($show_left) : ?>
                <div class="laendernavigation-left">
                    <?php if ($is_first && $has_overview) : ?>
                        <a href="<?php echo esc_url($overview_url); ?>">
                            <?php echo nl2br(wp_kses_post($overview_label)); ?>
                        </a>
                    <?php elseif ($left_post) : ?>
                        <a href="<?php echo esc_url(get_permalink($left_post)); ?>">
                            <?php echo esc_html($left_prefix . get_the_title($left_post)); ?>
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <?php if ($show_right && $right_post) : ?>
                <div class="laendernavigation-right">
                    <a href="<?php echo esc_url(get_permalink($right_post)); ?>">
                        <?php echo esc_html($right_prefix . get_the_title($right_post)); ?>
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
<?php endif; ?>
