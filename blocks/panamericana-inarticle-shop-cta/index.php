<?php
if (!function_exists('rueckenwinde_detect_panamericana_country_name')) {
    function rueckenwinde_detect_panamericana_country_name($post_id) {
        $country_map = array(
            'alaska' => 'Alaska',
            'kanada' => 'Kanada',
            'canada' => 'Kanada',
            'usa' => 'USA',
            'vereinigte-staaten' => 'USA',
            'mexiko' => 'Mexiko',
            'mexico' => 'Mexiko',
            'guatemala' => 'Guatemala',
            'belize' => 'Belize',
            'honduras' => 'Honduras',
            'el-salvador' => 'El Salvador',
            'nicaragua' => 'Nicaragua',
            'costa-rica' => 'Costa Rica',
            'panama' => 'Panama',
            'kolumbien' => 'Kolumbien',
            'colombia' => 'Kolumbien',
            'ecuador' => 'Ecuador',
            'peru' => 'Peru',
            'bolivien' => 'Bolivien',
            'bolivia' => 'Bolivien',
            'chile' => 'Chile',
            'argentinien' => 'Argentinien',
            'argentina' => 'Argentinien',
            'uruguay' => 'Uruguay'
        );

        $terms = get_the_terms($post_id, 'post_tag');
        if (!is_wp_error($terms) && is_array($terms)) {
            foreach ($terms as $term) {
                $slug = sanitize_title($term->slug);
                if (isset($country_map[$slug])) {
                    return $country_map[$slug];
                }
                $name_slug = sanitize_title($term->name);
                if (isset($country_map[$name_slug])) {
                    return $country_map[$name_slug];
                }
            }
        }

        $categories = get_the_category($post_id);
        if (is_array($categories)) {
            foreach ($categories as $category) {
                $slug = sanitize_title($category->slug);
                if (isset($country_map[$slug])) {
                    return $country_map[$slug];
                }
                $name_slug = sanitize_title($category->name);
                if (isset($country_map[$name_slug])) {
                    return $country_map[$name_slug];
                }
            }
        }

        $title = get_the_title($post_id);
        if (is_string($title) && $title !== '') {
            $title_slug = sanitize_title($title);
            foreach ($country_map as $slug => $country_name) {
                if (strpos($title_slug, $slug) !== false) {
                    return $country_name;
                }
            }
        }

        return '';
    }
}

$icon = isset($attributes['icon']) ? sanitize_text_field($attributes['icon']) : '🧭';
$headline = isset($attributes['headline']) ? sanitize_text_field($attributes['headline']) : 'Hinter den Kulissen: Die Fakten zu diesem Abschnitt';
$text_template = isset($attributes['textTemplate']) ? sanitize_text_field($attributes['textTemplate']) : 'Ich teile hier meine Reiseberichte, aber im kompletten Panamericana-Guide findest du alle GPS-Daten, Grenz-Hacks und Kostenaufstellungen fuer [Dynamic_Country_Name].';
$button_label = isset($attributes['buttonLabel']) ? sanitize_text_field($attributes['buttonLabel']) : 'Hol dir den Guide (PDF)';
$button_url = isset($attributes['buttonUrl']) ? esc_url($attributes['buttonUrl']) : '#';
$fallback_country = isset($attributes['fallbackCountry']) ? sanitize_text_field($attributes['fallbackCountry']) : 'dieses Land';

$post_id = get_the_ID();
$country_name = $post_id ? rueckenwinde_detect_panamericana_country_name($post_id) : '';
if ($country_name === '') {
    $country_name = $fallback_country;
}

$text = str_replace('[Dynamic_Country_Name]', $country_name, $text_template);
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'panamericana-inarticle-shop-cta-' . wp_unique_id();
?>

<section id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-panamericana-inarticle-shop-cta" aria-label="Panamericana Guide CTA">
    <div class="panamericana-inarticle-shop-cta__card">
        <span class="panamericana-inarticle-shop-cta__icon" aria-hidden="true"><?php echo esc_html($icon); ?></span>
        <h3 class="panamericana-inarticle-shop-cta__headline"><?php echo esc_html($headline); ?></h3>
        <p class="panamericana-inarticle-shop-cta__text"><?php echo esc_html($text); ?></p>
        <a class="panamericana-inarticle-shop-cta__button" href="<?php echo esc_url($button_url); ?>"><?php echo esc_html($button_label); ?></a>
    </div>
</section>
