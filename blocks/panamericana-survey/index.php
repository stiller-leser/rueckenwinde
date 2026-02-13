<?php
/**
 * Panamericana Survey Block - Server Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

if (!isset($attributes) || !is_array($attributes)) {
    $attributes = array();
}

$default_questions = array(
    'Kannst du gut damit umgehen, nicht zu wissen, was morgen passiert?',
    'Reizt dich der Weg mehr als das Ziel?',
    'Kommst du mit langen Phasen von Ruhe, Weite und wenig Input klar?',
    'Bist du bereit, Plaene spontan ueber Bord zu werfen?',
    'Kannst du mehrere Tage auf engem Raum leben?',
    'Ist Freistehen fuer dich wichtiger als Komfort?',
    'Stoert es dich nicht, wenn Infrastruktur fehlt (Duschen, Toiletten, WLAN)?',
    'Bist du bereit, dein Fahrzeug selbst zu pflegen und kleine Probleme zu loesen?',
    'Machst du auch lange Fahrten, ohne dass jeden Tag etwas "passiert"?',
    'Kommst du mit schlechten Strassen, Wind und Wetter klar?',
    'Faehrst du lieber langsam als moeglichst effizient?',
    'Hast du Geduld mit Buerokratie, Grenzen und Regeln?',
    'Kannst du akzeptieren, dass Dinge in anderen Laendern anders laufen?',
    'Ist Improvisation fuer dich kein Stress, sondern Teil des Abenteuers?',
    'Kannst du mit finanzieller Unsicherheit umgehen (Wechselkurse, Preise)?',
    'Bist du bereit, dein Sicherheitsgefuehl staendig neu anzupassen?'
);

$heading = 'Ist die Panamericana das Richtige fuer dich?';
if (isset($attributes['heading']) && is_scalar($attributes['heading'])) {
    $heading = wp_kses_post((string) $attributes['heading']);
}

$intro = 'Beantworte die 16 Fragen mit Ja oder Nein.';
if (isset($attributes['intro']) && is_scalar($attributes['intro'])) {
    $intro = wp_kses_post((string) $attributes['intro']);
}

$yes_label = 'Ja';
if (isset($attributes['yesLabel']) && is_scalar($attributes['yesLabel'])) {
    $yes_label = wp_kses_post((string) $attributes['yesLabel']);
}

$no_label = 'Nein';
if (isset($attributes['noLabel']) && is_scalar($attributes['noLabel'])) {
    $no_label = wp_kses_post((string) $attributes['noLabel']);
}

$submit_label = 'Ergebnis anzeigen';
if (isset($attributes['submitLabel']) && is_scalar($attributes['submitLabel'])) {
    $submit_label = wp_kses_post((string) $attributes['submitLabel']);
}

$incomplete_message = 'Bitte beantworte zuerst alle 16 Fragen.';
if (isset($attributes['incompleteMessage']) && is_scalar($attributes['incompleteMessage'])) {
    $incomplete_message = wp_kses_post((string) $attributes['incompleteMessage']);
}

$result_mostly_yes = 'Die Panamericana ist ein Fit fuer dich.';
if (isset($attributes['resultMostlyYes']) && is_scalar($attributes['resultMostlyYes'])) {
    $result_mostly_yes = wp_kses_post((string) $attributes['resultMostlyYes']);
}

$result_half = 'Die Panamericana koennte fuer dich funktionieren.';
if (isset($attributes['resultHalf']) && is_scalar($attributes['resultHalf'])) {
    $result_half = wp_kses_post((string) $attributes['resultHalf']);
}

$result_mostly_no = 'Die Panamericana ist wahrscheinlich nicht das richtige Abenteuer fuer dich.';
if (isset($attributes['resultMostlyNo']) && is_scalar($attributes['resultMostlyNo'])) {
    $result_mostly_no = wp_kses_post((string) $attributes['resultMostlyNo']);
}

$questions = array();
if (isset($attributes['questions']) && is_array($attributes['questions'])) {
    $questions = array_values($attributes['questions']);
}
$questions = array_slice($questions, 0, 16);

foreach ($questions as $i => $question) {
    if (is_scalar($question)) {
        $questions[$i] = wp_kses_post((string) $question);
    } else {
        $questions[$i] = '';
    }
}

while (count($questions) < 16) {
    $questions[] = $default_questions[count($questions)];
}

$anchor = '';
if (isset($attributes['anchor']) && is_scalar($attributes['anchor'])) {
    $anchor = sanitize_html_class((string) $attributes['anchor']);
}
$block_id = $anchor !== '' ? $anchor : 'panamericana-survey-' . uniqid();
?>

<div
    id="<?php echo esc_attr($block_id); ?>"
    class="wp-block-rueckenwinde-panamericana-survey"
    data-total-questions="16"
    data-incomplete-message="<?php echo esc_attr(wp_strip_all_tags($incomplete_message)); ?>"
    data-result-mostly-yes="<?php echo esc_attr(wp_strip_all_tags($result_mostly_yes)); ?>"
    data-result-half="<?php echo esc_attr(wp_strip_all_tags($result_half)); ?>"
    data-result-mostly-no="<?php echo esc_attr(wp_strip_all_tags($result_mostly_no)); ?>"
>
    <div class="panamericana-survey-container">
        <h3 class="panamericana-survey-heading"><?php echo nl2br(wp_kses_post($heading)); ?></h3>
        <p class="panamericana-survey-intro"><?php echo nl2br(wp_kses_post($intro)); ?></p>

        <p class="panamericana-survey-progress" aria-live="polite"></p>

        <div class="panamericana-survey-grid">
            <?php foreach ($questions as $index => $question) : ?>
                <?php $question_id = 'panamericana-question-' . $block_id . '-' . $index; ?>
                <div class="panamericana-survey-card" data-question-index="<?php echo esc_attr((string) $index); ?>">
                    <p class="panamericana-survey-question-number">Frage <?php echo esc_html((string) ($index + 1)); ?></p>
                    <p class="panamericana-survey-question"><?php echo nl2br(wp_kses_post($question)); ?></p>
                    <fieldset class="panamericana-survey-options">
                        <legend class="screen-reader-text"><?php echo esc_html(wp_strip_all_tags($question)); ?></legend>
                        <label for="<?php echo esc_attr($question_id . '-yes'); ?>" class="panamericana-survey-option">
                            <input
                                id="<?php echo esc_attr($question_id . '-yes'); ?>"
                                type="radio"
                                name="<?php echo esc_attr($question_id); ?>"
                                value="yes"
                            >
                            <span><?php echo nl2br(wp_kses_post($yes_label)); ?></span>
                        </label>
                        <label for="<?php echo esc_attr($question_id . '-no'); ?>" class="panamericana-survey-option">
                            <input
                                id="<?php echo esc_attr($question_id . '-no'); ?>"
                                type="radio"
                                name="<?php echo esc_attr($question_id); ?>"
                                value="no"
                            >
                            <span><?php echo nl2br(wp_kses_post($no_label)); ?></span>
                        </label>
                    </fieldset>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="panamericana-survey-actions">
            <button type="button" class="panamericana-survey-prev">Zurueck</button>
            <button type="button" class="panamericana-survey-next">Weiter</button>
            <button type="button" class="panamericana-survey-submit"><?php echo nl2br(wp_kses_post($submit_label)); ?></button>
        </div>

        <div class="panamericana-survey-result" hidden aria-live="polite">
            <p class="panamericana-survey-result-title"></p>
            <p class="panamericana-survey-result-text"></p>
        </div>
    </div>
</div>
