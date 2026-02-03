<?php
/**
 * Render callback for Länderinfo Block
 */

return function ( $attributes = [], $content = '', $block = null ) {

    // Log locally to plugin debug file instead of var_dump (var_dump can break REST responses)
    $debug_file = plugin_dir_path( __FILE__ ) . '../../rueckenwinde-debug.log';
    @file_put_contents( $debug_file, '[' . date( 'c' ) . '] index.php render called. Attributes: ' . wp_json_encode( $attributes ) . PHP_EOL, FILE_APPEND | LOCK_EX );

    $title = ! empty( $attributes['title'] ) ? $attributes['title'] : '💡 Wichtig zu wissen';
    $visum = ! empty( $attributes['visum'] ) ? $attributes['visum'] : 'Visa on Arrival, 30 Tage';
    $sprache = ! empty( $attributes['sprache'] ) ? $attributes['sprache'] : 'Spanisch';
    $preisniveau = ! empty( $attributes['preisniveau'] ) ? $attributes['preisniveau'] : 'Günstig';
    $waehrung = ! empty( $attributes['waehrung'] ) ? $attributes['waehrung'] : 'Peso';
    $besteReisezeit = ! empty( $attributes['besteReisezeit'] ) ? $attributes['besteReisezeit'] : 'April – Oktober';
    $fortbewegung = ! empty( $attributes['fortbewegung'] ) ? $attributes['fortbewegung'] : 'Bus, Mietwagen';
    $adapter = ! empty( $attributes['adapter'] ) ? $attributes['adapter'] : 'Typ C/F';
    $simkarte = ! empty( $attributes['simkarte'] ) ? $attributes['simkarte'] : 'Lokale Anbieter';

    ob_start();
    ?>

    <div class="wp-block-rueckenwinde-laenderinfo country-info-box has-pale-cyan-blue-background-color has-background"
         style="border-radius:8px;padding:2rem;">

        <!-- wp:heading {"level":2} -->
        <h2 class="wp-block-heading"><?php echo esc_html( $title ); ?></h2>
        <!-- /wp:heading -->

        <!-- wp:columns -->
        <div class="wp-block-columns">

            <!-- wp:column -->
            <div class="wp-block-column">
                <ul>
                    <li>🛂 <strong>Visum:</strong> <?php echo esc_html( $visum ); ?></li>
                    <li>💬 <strong>Sprache:</strong> <?php echo esc_html( $sprache ); ?></li>
                    <li>🏷️ <strong>Preisniveau:</strong> <?php echo esc_html( $preisniveau ); ?></li>
                    <li>💰 <strong>Währung:</strong> <?php echo esc_html( $waehrung ); ?></li>
                </ul>
            </div>
            <!-- /wp:column -->

            <!-- wp:column -->
            <div class="wp-block-column">
                <ul>
                    <li>☀️ <strong>Beste Reisezeit:</strong> <?php echo esc_html( $besteReisezeit ); ?></li>
                    <li>🚘 <strong>Fortbewegung:</strong> <?php echo esc_html( $fortbewegung ); ?></li>
                    <li>🔌 <strong>Adapter:</strong> <?php echo esc_html( $adapter ); ?></li>
                    <li>📱 <strong>SIM-Karte:</strong> <?php echo esc_html( $simkarte ); ?></li>
                </ul>
            </div>
            <!-- /wp:column -->

        </div>
        <!-- /wp:columns -->

    </div>

    <?php
    return ob_get_clean();
};
