<?php

defined('ABSPATH') || exit;

add_action('admin_init', 'rueckenwinde_cta_register_settings');
function rueckenwinde_cta_register_settings() {
    register_setting('rueckenwinde_cta_settings_group', 'rueckenwinde_cta_settings', array(
        'type'              => 'array',
        'sanitize_callback' => 'rueckenwinde_cta_sanitize_settings',
        'default'           => array(
            'headline'          => 'Lass uns deine Route checken',
            'text'              => 'Seit ueber drei Jahren sind wir auf der Panamericana unterwegs. Wir helfen dir, typische Fehler zu vermeiden und deine Planung auf echte Praxis abzustimmen.',
            'bullet_time'       => 'Mehr Zeit durch klare Prioritaeten',
            'bullet_safety'     => 'Mehr Sicherheit durch erprobte Routen',
            'bullet_contacts'   => 'Insider-Kontakte vor Ort',
            'button_label'      => 'Jetzt Termin anfragen',
            'button_url'        => '#',
            'profile_image_url' => '',
        ),
    ));
}

function rueckenwinde_cta_sanitize_settings($input) {
    $input = is_array($input) ? $input : array();
    return array(
        'headline'          => isset($input['headline']) ? sanitize_text_field($input['headline']) : '',
        'text'              => isset($input['text']) ? sanitize_textarea_field($input['text']) : '',
        'bullet_time'       => isset($input['bullet_time']) ? sanitize_text_field($input['bullet_time']) : '',
        'bullet_safety'     => isset($input['bullet_safety']) ? sanitize_text_field($input['bullet_safety']) : '',
        'bullet_contacts'   => isset($input['bullet_contacts']) ? sanitize_text_field($input['bullet_contacts']) : '',
        'button_label'      => isset($input['button_label']) ? sanitize_text_field($input['button_label']) : '',
        'button_url'        => isset($input['button_url']) ? esc_url_raw($input['button_url']) : '',
        'profile_image_url' => isset($input['profile_image_url']) ? esc_url_raw($input['profile_image_url']) : '',
    );
}

add_action('admin_menu', 'rueckenwinde_cta_add_admin_page');
function rueckenwinde_cta_add_admin_page() {
    add_options_page(
        'Rueckenwind CTA',
        'Rueckenwind CTA',
        'manage_options',
        'rueckenwind-cta',
        'rueckenwinde_cta_render_page'
    );
}

function rueckenwinde_cta_render_page() {
    $settings = get_option('rueckenwinde_cta_settings', array());
    $settings = is_array($settings) ? $settings : array();
    ?>
    <div class="wrap">
        <h1>Rueckenwind CTA</h1>
        <form method="post" action="options.php">
            <?php settings_fields('rueckenwinde_cta_settings_group'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_headline">Headline</label></th>
                    <td><input id="rueckenwinde_cta_headline" class="regular-text" type="text" name="rueckenwinde_cta_settings[headline]" value="<?php echo esc_attr(isset($settings['headline']) ? $settings['headline'] : ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_text">Text</label></th>
                    <td><textarea id="rueckenwinde_cta_text" class="large-text" rows="4" name="rueckenwinde_cta_settings[text]"><?php echo esc_textarea(isset($settings['text']) ? $settings['text'] : ''); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_bullet_time">Bullet 1</label></th>
                    <td><input id="rueckenwinde_cta_bullet_time" class="regular-text" type="text" name="rueckenwinde_cta_settings[bullet_time]" value="<?php echo esc_attr(isset($settings['bullet_time']) ? $settings['bullet_time'] : ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_bullet_safety">Bullet 2</label></th>
                    <td><input id="rueckenwinde_cta_bullet_safety" class="regular-text" type="text" name="rueckenwinde_cta_settings[bullet_safety]" value="<?php echo esc_attr(isset($settings['bullet_safety']) ? $settings['bullet_safety'] : ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_bullet_contacts">Bullet 3</label></th>
                    <td><input id="rueckenwinde_cta_bullet_contacts" class="regular-text" type="text" name="rueckenwinde_cta_settings[bullet_contacts]" value="<?php echo esc_attr(isset($settings['bullet_contacts']) ? $settings['bullet_contacts'] : ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_button_label">Button Text</label></th>
                    <td><input id="rueckenwinde_cta_button_label" class="regular-text" type="text" name="rueckenwinde_cta_settings[button_label]" value="<?php echo esc_attr(isset($settings['button_label']) ? $settings['button_label'] : ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_button_url">Button URL</label></th>
                    <td><input id="rueckenwinde_cta_button_url" class="regular-text" type="url" name="rueckenwinde_cta_settings[button_url]" value="<?php echo esc_attr(isset($settings['button_url']) ? $settings['button_url'] : ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_cta_profile_image_url">Profilbild URL</label></th>
                    <td><input id="rueckenwinde_cta_profile_image_url" class="regular-text" type="url" name="rueckenwinde_cta_settings[profile_image_url]" value="<?php echo esc_attr(isset($settings['profile_image_url']) ? $settings['profile_image_url'] : ''); ?>"></td>
                </tr>
            </table>
            <?php submit_button('CTA speichern'); ?>
        </form>
    </div>
    <?php
}

add_action('admin_init', 'rueckenwinde_shop_cta_register_settings');
function rueckenwinde_shop_cta_register_settings() {
    register_setting('rueckenwinde_shop_cta_settings_group', 'rueckenwinde_shop_cta_settings', array(
        'type'              => 'array',
        'sanitize_callback' => 'rueckenwinde_shop_cta_sanitize_settings',
        'default'           => array(
            'icon'            => '🧭',
            'headline'        => 'Hinter den Kulissen: Die Fakten zu diesem Abschnitt',
            'text_template'   => 'Ich teile hier meine Reiseberichte, aber im kompletten Panamericana-Guide findest du alle GPS-Daten, Grenz-Hacks und Kostenaufstellungen fuer [Dynamic_Country_Name].',
            'button_label'    => 'Hol dir den Guide (PDF)',
            'button_url'      => '#',
            'fallback_country' => 'dieses Land',
        ),
    ));
}

function rueckenwinde_shop_cta_sanitize_settings($input) {
    $input = is_array($input) ? $input : array();
    return array(
        'icon'             => isset($input['icon']) ? sanitize_text_field($input['icon']) : '🧭',
        'headline'         => isset($input['headline']) ? sanitize_text_field($input['headline']) : '',
        'text_template'    => isset($input['text_template']) ? sanitize_textarea_field($input['text_template']) : '',
        'button_label'     => isset($input['button_label']) ? sanitize_text_field($input['button_label']) : '',
        'button_url'       => isset($input['button_url']) ? esc_url_raw($input['button_url']) : '',
        'fallback_country' => isset($input['fallback_country']) ? sanitize_text_field($input['fallback_country']) : '',
    );
}

add_action('admin_menu', 'rueckenwinde_shop_cta_add_admin_page');
function rueckenwinde_shop_cta_add_admin_page() {
    add_options_page(
        'Panamericana Shop CTA',
        'Panamericana Shop CTA',
        'manage_options',
        'rueckenwind-panamericana-shop-cta',
        'rueckenwinde_shop_cta_render_page'
    );
}

function rueckenwinde_shop_cta_render_page() {
    $defaults = array(
        'icon'             => '🧭',
        'headline'         => 'Hinter den Kulissen: Die Fakten zu diesem Abschnitt',
        'text_template'    => 'Ich teile hier meine Reiseberichte, aber im kompletten Panamericana-Guide findest du alle GPS-Daten, Grenz-Hacks und Kostenaufstellungen fuer [Dynamic_Country_Name].',
        'button_label'     => 'Hol dir den Guide (PDF)',
        'button_url'       => '#',
        'fallback_country' => 'dieses Land',
    );
    $settings = get_option('rueckenwinde_shop_cta_settings', array());
    $settings = is_array($settings) ? wp_parse_args($settings, $defaults) : $defaults;
    ?>
    <div class="wrap">
        <h1>Panamericana Shop CTA</h1>
        <form method="post" action="options.php">
            <?php settings_fields('rueckenwinde_shop_cta_settings_group'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="rueckenwinde_shop_cta_icon">Icon</label></th>
                    <td><input id="rueckenwinde_shop_cta_icon" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[icon]" value="<?php echo esc_attr($settings['icon']); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_shop_cta_headline">Headline</label></th>
                    <td><input id="rueckenwinde_shop_cta_headline" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[headline]" value="<?php echo esc_attr($settings['headline']); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_shop_cta_text_template">Text-Template</label></th>
                    <td>
                        <textarea id="rueckenwinde_shop_cta_text_template" class="large-text" rows="5" name="rueckenwinde_shop_cta_settings[text_template]"><?php echo esc_textarea($settings['text_template']); ?></textarea>
                        <p class="description">Platzhalter fuer Land: <code>[Dynamic_Country_Name]</code></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_shop_cta_button_label">Button Text</label></th>
                    <td><input id="rueckenwinde_shop_cta_button_label" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[button_label]" value="<?php echo esc_attr($settings['button_label']); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_shop_cta_button_url">Button URL</label></th>
                    <td><input id="rueckenwinde_shop_cta_button_url" class="regular-text" type="url" name="rueckenwinde_shop_cta_settings[button_url]" value="<?php echo esc_attr($settings['button_url']); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="rueckenwinde_shop_cta_fallback_country">Fallback-Land</label></th>
                    <td><input id="rueckenwinde_shop_cta_fallback_country" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[fallback_country]" value="<?php echo esc_attr($settings['fallback_country']); ?>"></td>
                </tr>
            </table>
            <?php submit_button('Shop-CTA speichern'); ?>
        </form>
    </div>
    <?php
}
