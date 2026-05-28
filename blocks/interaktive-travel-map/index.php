<?php
if (!function_exists('rueckenwinde_itm_sanitize_points')) {
    function rueckenwinde_itm_sanitize_points($points) {
        $safe = array();
        if (!is_array($points)) {
            return $safe;
        }

        foreach ($points as $point) {
            if (!is_array($point) && !is_object($point)) {
                continue;
            }
            $point = (array) $point;
            if (!isset($point['lat']) || !isset($point['lng'])) {
                continue;
            }
            $safe[] = array(
                'lat' => (float) $point['lat'],
                'lng' => (float) $point['lng'],
                'label' => isset($point['label']) ? sanitize_text_field($point['label']) : ''
            );
        }

        return $safe;
    }
}

if (!function_exists('rueckenwinde_itm_sanitize_countries')) {
    function rueckenwinde_itm_sanitize_countries($countries) {
        $safe = array();
        if (!is_array($countries)) {
            return $safe;
        }

        foreach ($countries as $country) {
            if (!is_array($country) && !is_object($country)) {
                continue;
            }
            $country = (array) $country;
            $polygon = isset($country['polygon']) ? rueckenwinde_itm_sanitize_points($country['polygon']) : array();
            if (count($polygon) < 3) {
                continue;
            }

            $safe[] = array(
                'name' => isset($country['name']) ? sanitize_text_field($country['name']) : 'Land',
                'postUrl' => isset($country['postUrl']) ? esc_url($country['postUrl']) : '',
                'linkLabel' => isset($country['linkLabel']) ? sanitize_text_field($country['linkLabel']) : 'Zum Blog-Beitrag',
                'polygon' => $polygon
            );
        }

        return $safe;
    }
}

$title = isset($attributes['title']) ? sanitize_text_field($attributes['title']) : 'Unsere Reiseroute live';
$height = isset($attributes['height']) ? (int) $attributes['height'] : 520;
if ($height < 260) {
    $height = 260;
}

$config = array(
    'initialCenterLat' => isset($attributes['initialCenterLat']) ? (float) $attributes['initialCenterLat'] : -16.5,
    'initialCenterLng' => isset($attributes['initialCenterLng']) ? (float) $attributes['initialCenterLng'] : -66.2,
    'initialZoom' => isset($attributes['initialZoom']) ? (int) $attributes['initialZoom'] : 4,
    'brandColor' => isset($attributes['brandColor']) ? sanitize_hex_color($attributes['brandColor']) : '#123a6f',
    'routeWeight' => isset($attributes['routeWeight']) ? (int) $attributes['routeWeight'] : 4,
    'routeOpacity' => isset($attributes['routeOpacity']) ? (float) $attributes['routeOpacity'] : 0.95,
    'countryFillColor' => isset($attributes['countryFillColor']) ? sanitize_hex_color($attributes['countryFillColor']) : '#123a6f',
    'countryFillOpacity' => isset($attributes['countryFillOpacity']) ? (float) $attributes['countryFillOpacity'] : 0.2,
    'countryStrokeColor' => isset($attributes['countryStrokeColor']) ? sanitize_hex_color($attributes['countryStrokeColor']) : '#123a6f',
    'countryStrokeWeight' => isset($attributes['countryStrokeWeight']) ? (int) $attributes['countryStrokeWeight'] : 1,
    'currentLat' => isset($attributes['currentLat']) ? (float) $attributes['currentLat'] : -41.1335,
    'currentLng' => isset($attributes['currentLng']) ? (float) $attributes['currentLng'] : -71.3103,
    'currentLabel' => isset($attributes['currentLabel']) ? sanitize_text_field($attributes['currentLabel']) : 'Aktueller Standort',
    'mapTileUrl' => isset($attributes['mapTileUrl']) ? sanitize_text_field($attributes['mapTileUrl']) : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    'mapTileAttribution' => isset($attributes['mapTileAttribution']) ? wp_kses_post($attributes['mapTileAttribution']) : '&copy; OpenStreetMap contributors &copy; CARTO',
    'mapMaxZoom' => isset($attributes['mapMaxZoom']) ? (int) $attributes['mapMaxZoom'] : 19,
    'enableFullscreen' => !empty($attributes['enableFullscreen']),
    'fullscreenLabel' => isset($attributes['fullscreenLabel']) ? sanitize_text_field($attributes['fullscreenLabel']) : 'Full Screen',
    'exitFullscreenLabel' => isset($attributes['exitFullscreenLabel']) ? sanitize_text_field($attributes['exitFullscreenLabel']) : 'Exit Full Screen',
    'routePoints' => isset($attributes['routePoints']) ? rueckenwinde_itm_sanitize_points($attributes['routePoints']) : array(),
    'visitedCountries' => isset($attributes['visitedCountries']) ? rueckenwinde_itm_sanitize_countries($attributes['visitedCountries']) : array()
);

if (!$config['brandColor']) {
    $config['brandColor'] = '#123a6f';
}
if (!$config['countryFillColor']) {
    $config['countryFillColor'] = '#123a6f';
}
if (!$config['countryStrokeColor']) {
    $config['countryStrokeColor'] = '#123a6f';
}

$map_id = 'itm-map-' . wp_unique_id();
?>

<section class="wp-block-rueckenwinde-interaktive-travel-map" aria-label="Interaktive Travel-Map">
    <?php if ($title !== '') : ?>
        <h3 class="itm-title"><?php echo esc_html($title); ?></h3>
    <?php endif; ?>

    <div
        id="<?php echo esc_attr($map_id); ?>"
        class="itm-map"
        style="height: <?php echo esc_attr($height); ?>px"
        data-map-config="<?php echo esc_attr(wp_json_encode($config, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)); ?>"
    ></div>
</section>
