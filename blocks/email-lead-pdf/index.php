<?php
$title = isset($attributes['title']) ? sanitize_text_field($attributes['title']) : 'Hol dir den Guide als PDF';
$description = isset($attributes['description']) ? sanitize_textarea_field($attributes['description']) : 'Trag dich ein, bestaetige deine E-Mail (Double Opt-In) und erhalte sofort den Download-Link.';
$email_placeholder = isset($attributes['emailPlaceholder']) ? sanitize_text_field($attributes['emailPlaceholder']) : 'deine@email.de';
$consent_text = isset($attributes['consentText']) ? sanitize_text_field($attributes['consentText']) : 'Ich moechte das PDF erhalten und bin einverstanden, weitere E-Mails zu Panamericana-Updates zu bekommen. Ich kann mich jederzeit abmelden.';
$submit_label = isset($attributes['submitLabel']) ? sanitize_text_field($attributes['submitLabel']) : 'PDF anfordern';
$pdf_url = isset($attributes['pdfUrl']) ? esc_url_raw($attributes['pdfUrl']) : '';
$pdf_label = isset($attributes['pdfLabel']) ? sanitize_text_field($attributes['pdfLabel']) : 'Jetzt PDF herunterladen';
$confirm_subject = isset($attributes['confirmSubject']) ? sanitize_text_field($attributes['confirmSubject']) : 'Bitte bestaetige deine Anmeldung';
$confirm_body = isset($attributes['confirmBody']) ? sanitize_textarea_field($attributes['confirmBody']) : "Danke fuer dein Interesse. Bitte bestaetige deine Anmeldung ueber diesen Link:\n\n{{confirm_url}}\n\nDanach senden wir dir dein PDF.";
$delivery_subject = isset($attributes['deliverySubject']) ? sanitize_text_field($attributes['deliverySubject']) : 'Hier ist dein PDF';
$delivery_body = isset($attributes['deliveryBody']) ? sanitize_textarea_field($attributes['deliveryBody']) : "Super, deine Anmeldung ist bestaetigt. Hier ist dein PDF:\n\n{{pdf_url}}\n\nViel Erfolg bei deiner Planung!";
$check_email_message = isset($attributes['checkEmailMessage']) ? sanitize_text_field($attributes['checkEmailMessage']) : 'Fast geschafft: Bitte pruefe dein Postfach und bestaetige deine E-Mail.';
$confirmed_message = isset($attributes['confirmedMessage']) ? sanitize_text_field($attributes['confirmedMessage']) : 'Danke! Deine E-Mail ist bestaetigt. Das PDF wurde dir zugesendet.';
$already_confirmed_message = isset($attributes['alreadyConfirmedMessage']) ? sanitize_text_field($attributes['alreadyConfirmedMessage']) : 'Diese E-Mail ist bereits bestaetigt. Wir haben dir den PDF-Link erneut geschickt.';
$error_message = isset($attributes['errorMessage']) ? sanitize_text_field($attributes['errorMessage']) : 'Bitte gib eine gueltige E-Mail ein und stimme der Einwilligung zu.';

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'email-lead-pdf-' . wp_unique_id();
$redirect_url = get_permalink();
$status = isset($_GET['rw_lead_status']) ? sanitize_key($_GET['rw_lead_status']) : '';
$active_message = '';
$active_class = '';

if ($status === 'check_email') {
    $active_message = $check_email_message;
    $active_class = 'is-success';
} elseif ($status === 'confirmed') {
    $active_message = $confirmed_message;
    $active_class = 'is-success';
} elseif ($status === 'already_confirmed') {
    $active_message = $already_confirmed_message;
    $active_class = 'is-success';
} elseif ($status === 'invalid' || $status === 'error') {
    $active_message = $error_message;
    $active_class = 'is-error';
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-email-lead-pdf" aria-label="E-Mail Lead Formular">
    <div class="email-lead-pdf__card">
        <?php if ($title !== '') : ?>
            <h3 class="email-lead-pdf__title"><?php echo esc_html($title); ?></h3>
        <?php endif; ?>

        <?php if ($description !== '') : ?>
            <p class="email-lead-pdf__description"><?php echo esc_html($description); ?></p>
        <?php endif; ?>

        <?php if ($active_message !== '') : ?>
            <p class="email-lead-pdf__notice <?php echo esc_attr($active_class); ?>"><?php echo esc_html($active_message); ?></p>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="email-lead-pdf__form">
            <input type="hidden" name="action" value="rueckenwinde_lead_capture_submit" />
            <input type="hidden" name="redirect_url" value="<?php echo esc_url($redirect_url); ?>" />
            <input type="hidden" name="pdf_url" value="<?php echo esc_attr($pdf_url); ?>" />
            <input type="hidden" name="pdf_label" value="<?php echo esc_attr($pdf_label); ?>" />
            <input type="hidden" name="confirm_subject" value="<?php echo esc_attr($confirm_subject); ?>" />
            <input type="hidden" name="confirm_body" value="<?php echo esc_attr($confirm_body); ?>" />
            <input type="hidden" name="delivery_subject" value="<?php echo esc_attr($delivery_subject); ?>" />
            <input type="hidden" name="delivery_body" value="<?php echo esc_attr($delivery_body); ?>" />

            <?php wp_nonce_field('rueckenwinde_lead_capture_submit', 'rw_lead_nonce'); ?>

            <label class="screen-reader-text" for="<?php echo esc_attr($block_id); ?>-email">E-Mail</label>
            <input id="<?php echo esc_attr($block_id); ?>-email" class="email-lead-pdf__email" type="email" name="email" placeholder="<?php echo esc_attr($email_placeholder); ?>" required />

            <input class="email-lead-pdf__honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />

            <label class="email-lead-pdf__consent">
                <input type="checkbox" name="consent" value="1" required />
                <span><?php echo esc_html($consent_text); ?></span>
            </label>

            <button type="submit" class="email-lead-pdf__button" disabled aria-disabled="true"><?php echo esc_html($submit_label); ?></button>
        </form>
    </div>
</section>
