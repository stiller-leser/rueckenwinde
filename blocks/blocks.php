<?php
/**
 * Custom Block Patterns für Länder-Guides
 * Füge diesen Code zu deiner rueckenwinde-functions.php hinzu
 * 
 * Diese Patterns kannst du dann im Block Editor unter "Patterns" finden
 */



/**
 * PATTERN 2: Reisezeit-Modul
 */
function rueckenwinde_register_reisezeit_pattern() {
    register_block_pattern(
        'rueckenwinde/reisezeit-modul',
        array(
            'title'       => __('Reisezeit-Modul', 'rueckenwinde'),
            'description' => __('Beste Reisezeit mit Bild und Beschreibung', 'rueckenwinde'),
            'categories'  => array('rueckenwinde-laender'),
            'content'     => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:2rem;padding-bottom:2rem">

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">🌦️ Beste Reisezeit für [LAND]</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns">

<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%">

<!-- wp:image {"sizeSlug":"large","linkDestination":"none","className":"is-style-rounded"} -->
<figure class="wp-block-image size-large is-style-rounded">
<img src="" alt="[LAND] Landschaft"/>
</figure>
<!-- /wp:image -->

</div>
<!-- /wp:column -->

<!-- wp:column {"width":"60%"} -->
<div class="wp-block-column" style="flex-basis:60%">

<!-- wp:paragraph -->
<p>Die <strong>beste Reisezeit</strong> für [LAND] ist von <strong>[Monate]</strong>. In dieser Zeit erwarten dich [Wetterbeschreibung].</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Hochsaison:</strong> [Monate] – perfektes Wetter, aber auch viele Touristen und höhere Preise.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Regenzeit:</strong> [Monate] – mit ca. XX Regentagen pro Monat. Reisen ist möglich, aber zu anderen Zeiten schöner.</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'rueckenwinde_register_reisezeit_pattern');

/**
 * PATTERN 3: Sehenswürdigkeiten-Grid
 */
function rueckenwinde_register_sehenswuerdigkeiten_pattern() {
    register_block_pattern(
        'rueckenwinde/sehenswuerdigkeiten-grid',
        array(
            'title'       => __('Sehenswürdigkeiten-Grid', 'rueckenwinde'),
            'description' => __('Grid mit Top Sehenswürdigkeiten des Landes', 'rueckenwinde'),
            'categories'  => array('rueckenwinde-laender'),
            'content'     => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:2rem;padding-bottom:2rem">

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">⭐️ Top Sehenswürdigkeiten in [LAND]</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns">

<!-- wp:column -->
<div class="wp-block-column">

<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem","left":"1.5rem","right":"1.5rem"}},"border":{"radius":"6px"}},"backgroundColor":"light-gray-1","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-light-gray-1-background-color has-background" style="border-radius:6px;padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">🏝️ [ORT 1]</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Kurze Beschreibung des Ortes mit Highlights und warum es sich lohnt.</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">

<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem","left":"1.5rem","right":"1.5rem"}},"border":{"radius":"6px"}},"backgroundColor":"light-gray-1","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-light-gray-1-background-color has-background" style="border-radius:6px;padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">🌴 [ORT 2]</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Kurze Beschreibung des Ortes mit Highlights und warum es sich lohnt.</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"2rem"}}}} -->
<p class="has-text-align-center" style="margin-top:2rem">➡️ <a href="#">Die schönsten Sehenswürdigkeiten in [LAND]</a></p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'rueckenwinde_register_sehenswuerdigkeiten_pattern');

/**
 * PATTERN 4: Routen-Vorschläge
 */
function rueckenwinde_register_routen_pattern() {
    register_block_pattern(
        'rueckenwinde/routen-vorschlaege',
        array(
            'title'       => __('Routen-Vorschläge', 'rueckenwinde'),
            'description' => __('Verschiedene Route-Optionen für unterschiedliche Reisedauern', 'rueckenwinde'),
            'categories'  => array('rueckenwinde-laender'),
            'content'     => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:2rem;padding-bottom:2rem">

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">🗺️ Routen für 2 Wochen und länger</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns">

<!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%">

<!-- wp:image {"sizeSlug":"large"} -->
<figure class="wp-block-image size-large">
<img src="" alt="[LAND] Route Karte"/>
<figcaption class="wp-element-caption">Route für 2 Wochen auf der Karte</figcaption>
</figure>
<!-- /wp:image -->

</div>
<!-- /wp:column -->

<!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%">

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">2 Wochen</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[Ort 1], [Ort 2], [Ort 3], [Ort 4]</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">3 Wochen</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[Ort 1], [Ort 2], [Ort 3], [Ort 4], [Ort 5]</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">4 Wochen</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[Ort 1], [Ort 2], [Ort 3], [Ort 4], [Ort 5], [Ort 6]</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'rueckenwinde_register_routen_pattern');

/**
 * PATTERN 5: Unterkünfte-Tabelle
 */
function rueckenwinde_register_unterkunft_pattern() {
    register_block_pattern(
        'rueckenwinde/unterkunft-tabelle',
        array(
            'title'       => __('Unterkünfte-Tabelle', 'rueckenwinde'),
            'description' => __('Empfohlene Unterkünfte in Tabellenform', 'rueckenwinde'),
            'categories'  => array('rueckenwinde-laender'),
            'content'     => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:2rem;padding-bottom:2rem">

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">🛏️ Unterkünfte in [LAND]</h2>
<!-- /wp:heading -->

<!-- wp:table {"className":"is-style-stripes unterkunft-tabelle"} -->
<figure class="wp-block-table is-style-stripes unterkunft-tabelle">
<table>
<thead>
<tr>
<th>Ort (A-Z)</th>
<th>Name</th>
<th>Preis</th>
</tr>
</thead>
<tbody>
<tr>
<td>[Ort 1]</td>
<td><strong><a href="#">[Unterkunft Name]*</a></strong></td>
<td>€</td>
</tr>
<tr>
<td>[Ort 2]</td>
<td><strong><a href="#">[Unterkunft Name]*</a></strong></td>
<td>€€</td>
</tr>
<tr>
<td>[Ort 3]</td>
<td><strong><a href="#">[Unterkunft Name]*</a></strong></td>
<td>€€€</td>
</tr>
</tbody>
</table>
</figure>
<!-- /wp:table -->

</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'rueckenwinde_register_unterkunft_pattern');

/**
 * PATTERN 6: Kosten-Übersicht
 */
function rueckenwinde_register_kosten_pattern() {
    register_block_pattern(
        'rueckenwinde/kosten-uebersicht',
        array(
            'title'       => __('Kosten-Übersicht', 'rueckenwinde'),
            'description' => __('Typische Kosten für eine Reise', 'rueckenwinde'),
            'categories'  => array('rueckenwinde-laender'),
            'content'     => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:2rem;padding-bottom:2rem">

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">💰 Kosten für eine Reise in [LAND]</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns">

<!-- wp:column -->
<div class="wp-block-column">

<!-- wp:list -->
<ul>
<li>🍜 <strong>Streetfood:</strong> 1-2 EUR pro Gericht</li>
<li>🍜 <strong>Lokales Restaurant:</strong> 3-5 EUR</li>
<li>🍜 <strong>Westliches Restaurant:</strong> 8-15 EUR</li>
<li>🛏️ <strong>Unterkunft (günstig):</strong> ab 10 EUR/Nacht</li>
</ul>
<!-- /wp:list -->

</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">

<!-- wp:list -->
<ul>
<li>🚌 <strong>Bus:</strong> ca. 5 EUR für 100 km</li>
<li>🛵 <strong>Moped:</strong> ca. 5 EUR pro Tag</li>
<li>🚕 <strong>Taxi:</strong> ab 10 EUR</li>
<li>🏛️ <strong>Sehenswürdigkeiten:</strong> 2-10 EUR</li>
</ul>
<!-- /wp:list -->

</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"1.5rem"}}}} -->
<p class="has-text-align-center" style="margin-top:1.5rem">➡️ <a href="#">Mehr zu den Kosten für [LAND]</a></p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'rueckenwinde_register_kosten_pattern');

/**
 * PATTERN 7: Essen & Trinken
 */
function rueckenwinde_register_essen_pattern() {
    register_block_pattern(
        'rueckenwinde/typisches-essen',
        array(
            'title'       => __('Typisches Essen', 'rueckenwinde'),
            'description' => __('Traditionelle Gerichte des Landes', 'rueckenwinde'),
            'categories'  => array('rueckenwinde-laender'),
            'content'     => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:2rem;padding-bottom:2rem">

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">🍜 Typisches Essen in [LAND]</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns">

<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%">

<!-- wp:image {"sizeSlug":"large","className":"is-style-rounded"} -->
<figure class="wp-block-image size-large is-style-rounded">
<img src="" alt="Typisches Essen in [LAND]"/>
</figure>
<!-- /wp:image -->

</div>
<!-- /wp:column -->

<!-- wp:column {"width":"60%"} -->
<div class="wp-block-column" style="flex-basis:60%">

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">[Gericht 1]</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Beschreibung des Gerichts – was ist drin, wie schmeckt es, wo bekommst du es.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">[Gericht 2]</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Beschreibung des Gerichts – was ist drin, wie schmeckt es, wo bekommst du es.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">[Gericht 3]</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Beschreibung des Gerichts – was ist drin, wie schmeckt es, wo bekommst du es.</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"1.5rem"}}}} -->
<p class="has-text-align-center" style="margin-top:1.5rem">➡️ <a href="#">Essen in [LAND] – Typische Gerichte</a></p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'rueckenwinde_register_essen_pattern');

/**
 * PATTERN 8: Quick-Links Navigation (wie bei Bali oben)
 */
function rueckenwinde_register_quicklinks_pattern() {
    register_block_pattern(
        'rueckenwinde/quicklinks-navigation',
        array(
            'title'       => __('Quick-Links Navigation', 'rueckenwinde'),
            'description' => __('Sticky Navigation zu Unterseiten', 'rueckenwinde'),
            'categories'  => array('rueckenwinde-laender'),
            'content'     => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"1rem","bottom":"1rem","left":"2rem","right":"2rem"}},"border":{"radius":"6px"}},"backgroundColor":"pale-pink","className":"quicklinks-nav","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"}} -->
<div class="wp-block-group quicklinks-nav has-pale-pink-background-color has-background" style="border-radius:6px;padding-top:1rem;padding-right:2rem;padding-bottom:1rem;padding-left:2rem">

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="#kosten">Kosten</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="#reisezeit">Reisezeit</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="#sehenswuerdigkeiten">Sehenswürdigkeiten</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="#unterkuenfte">Unterkünfte</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="#packliste">Packliste</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="#essen">Essen</a></p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'rueckenwinde_register_quicklinks_pattern');