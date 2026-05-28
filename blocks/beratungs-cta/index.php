<?php
$defaults = array(
    'headline' => 'Lass uns deine Route checken',
    'text' => 'Seit ueber drei Jahren sind wir auf der Panamericana unterwegs. Wir helfen dir, typische Fehler zu vermeiden und deine Planung auf echte Praxis abzustimmen.',
    'bullet_time' => 'Mehr Zeit durch klare Prioritaeten',
    'bullet_safety' => 'Mehr Sicherheit durch erprobte Routen',
    'bullet_contacts' => 'Insider-Kontakte vor Ort',
    'button_label' => 'Jetzt Termin anfragen',
    'button_url' => '#',
    'profile_image_url' => ''
);

$options = get_option('rueckenwinde_cta_settings', array());
$options = is_array($options) ? $options : array();
$settings = wp_parse_args($options, $defaults);

$headline_attr = isset($attributes['headline']) ? sanitize_text_field($attributes['headline']) : '';
$text_attr = isset($attributes['text']) ? sanitize_textarea_field($attributes['text']) : '';
$bullet_time_attr = isset($attributes['bulletTime']) ? sanitize_text_field($attributes['bulletTime']) : '';
$bullet_safety_attr = isset($attributes['bulletSafety']) ? sanitize_text_field($attributes['bulletSafety']) : '';
$bullet_contacts_attr = isset($attributes['bulletContacts']) ? sanitize_text_field($attributes['bulletContacts']) : '';
$button_label_attr = isset($attributes['buttonLabel']) ? sanitize_text_field($attributes['buttonLabel']) : '';
$button_url_attr = isset($attributes['buttonUrl']) ? esc_url_raw($attributes['buttonUrl']) : '';
$profile_image_url_attr = isset($attributes['profileImageUrl']) ? esc_url_raw($attributes['profileImageUrl']) : '';

$headline = $headline_attr !== '' ? $headline_attr : sanitize_text_field($settings['headline']);
$text = $text_attr !== '' ? $text_attr : sanitize_textarea_field($settings['text']);
$bullet_time = $bullet_time_attr !== '' ? $bullet_time_attr : sanitize_text_field($settings['bullet_time']);
$bullet_safety = $bullet_safety_attr !== '' ? $bullet_safety_attr : sanitize_text_field($settings['bullet_safety']);
$bullet_contacts = $bullet_contacts_attr !== '' ? $bullet_contacts_attr : sanitize_text_field($settings['bullet_contacts']);
$button_label = $button_label_attr !== '' ? $button_label_attr : sanitize_text_field($settings['button_label']);
$button_url = $button_url_attr !== '' ? esc_url($button_url_attr) : esc_url($settings['button_url']);
$profile_image_url = $profile_image_url_attr !== '' ? esc_url($profile_image_url_attr) : esc_url($settings['profile_image_url']);

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'beratungs-cta-' . wp_unique_id();
?>

<section id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-beratungs-cta" aria-label="Beratungs CTA">
    <div class="beratungs-cta-card">
        <div class="beratungs-cta-profile">
            <?php if ($profile_image_url !== '') : ?>
                <img src="<?php echo esc_url($profile_image_url); ?>" alt="Rueckenwind Experte" loading="lazy" />
            <?php else : ?>
                <div class="beratungs-cta-profile-placeholder" aria-hidden="true">RW</div>
            <?php endif; ?>
        </div>

        <div class="beratungs-cta-content">
            <h3 class="beratungs-cta-headline"><?php echo esc_html($headline); ?></h3>
            <p class="beratungs-cta-text"><?php echo esc_html($text); ?></p>

            <div class="beratungs-cta-benefits" role="list">
                <div class="beratungs-cta-benefit" role="listitem"><span class="icon" aria-hidden="true">⏱</span><span><?php echo esc_html($bullet_time); ?></span></div>
                <div class="beratungs-cta-benefit" role="listitem"><span class="icon" aria-hidden="true">🛡</span><span><?php echo esc_html($bullet_safety); ?></span></div>
                <div class="beratungs-cta-benefit" role="listitem"><span class="icon" aria-hidden="true">🤝</span><span><?php echo esc_html($bullet_contacts); ?></span></div>
            </div>

            <a class="beratungs-cta-button" href="<?php echo esc_url($button_url); ?>"><?php echo esc_html($button_label); ?></a>
        </div>
    </div>
</section>
