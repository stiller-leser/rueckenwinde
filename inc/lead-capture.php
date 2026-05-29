<?php

defined('ABSPATH') || exit;

if (!function_exists('rueckenwinde_lead_get_pending')) {
    function rueckenwinde_lead_get_pending() {
        return get_option('rueckenwinde_lead_pending', array());
    }
}

if (!function_exists('rueckenwinde_lead_get_confirmed')) {
    function rueckenwinde_lead_get_confirmed() {
        return get_option('rueckenwinde_lead_confirmed', array());
    }
}

if (!function_exists('rueckenwinde_lead_send_pdf_email')) {
    function rueckenwinde_lead_send_pdf_email($email, $subject, $body_template, $pdf_url, $pdf_label) {
        $subject = sanitize_text_field($subject);
        $body_template = sanitize_textarea_field($body_template);
        $pdf_url = esc_url_raw($pdf_url);
        $pdf_label = sanitize_text_field($pdf_label);

        if (!is_email($email) || $subject === '') {
            return false;
        }

        $replacements = array(
            '{{pdf_url}}'  => $pdf_url,
            '{{pdf_label}}' => $pdf_label,
        );
        $message = strtr($body_template, $replacements);

        return wp_mail($email, $subject, $message);
    }
}

if (!function_exists('rueckenwinde_lead_capture_submit')) {
    function rueckenwinde_lead_capture_submit() {
        if (!isset($_POST['rw_lead_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['rw_lead_nonce'])), 'rueckenwinde_lead_capture_submit')) {
            wp_die('Ungueltige Anfrage.');
        }

        $redirect_url = isset($_POST['redirect_url']) ? esc_url_raw(wp_unslash($_POST['redirect_url'])) : home_url('/');
        $redirect_url = wp_validate_redirect($redirect_url, home_url('/'));

        $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
        $consent = isset($_POST['consent']) ? (int) $_POST['consent'] : 0;
        $honeypot = isset($_POST['website']) ? trim((string) wp_unslash($_POST['website'])) : '';

        if ($honeypot !== '') {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'check_email', $redirect_url));
            exit;
        }

        if (!is_email($email) || $consent !== 1) {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', $redirect_url));
            exit;
        }

        $pdf_url = isset($_POST['pdf_url']) ? esc_url_raw(wp_unslash($_POST['pdf_url'])) : '';
        $pdf_label = isset($_POST['pdf_label']) ? sanitize_text_field(wp_unslash($_POST['pdf_label'])) : 'Jetzt PDF herunterladen';
        $confirm_subject = isset($_POST['confirm_subject']) ? sanitize_text_field(wp_unslash($_POST['confirm_subject'])) : 'Bitte bestaetige deine Anmeldung';
        $confirm_body = isset($_POST['confirm_body']) ? sanitize_textarea_field(wp_unslash($_POST['confirm_body'])) : "Danke fuer dein Interesse. Bitte bestaetige deine Anmeldung ueber diesen Link:\n\n{{confirm_url}}\n\nDanach senden wir dir dein PDF.";
        $delivery_subject = isset($_POST['delivery_subject']) ? sanitize_text_field(wp_unslash($_POST['delivery_subject'])) : 'Hier ist dein PDF';
        $delivery_body = isset($_POST['delivery_body']) ? sanitize_textarea_field(wp_unslash($_POST['delivery_body'])) : "Super, deine Anmeldung ist bestaetigt. Hier ist dein PDF:\n\n{{pdf_url}}\n\nViel Erfolg bei deiner Planung!";

        $confirmed = rueckenwinde_lead_get_confirmed();
        foreach ($confirmed as $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            if (strtolower($entry['email']) === strtolower($email)) {
                rueckenwinde_lead_send_pdf_email($email, $delivery_subject, $delivery_body, $pdf_url, $pdf_label);
                wp_safe_redirect(add_query_arg('rw_lead_status', 'already_confirmed', $redirect_url));
                exit;
            }
        }

        $token = wp_generate_password(32, false, false);
        $confirm_url = add_query_arg(
            array(
                'rw_lead_confirm' => '1',
                'token'           => $token,
            ),
            home_url('/')
        );

        $message = strtr($confirm_body, array('{{confirm_url}}' => $confirm_url));
        $mail_sent = wp_mail($email, $confirm_subject, $message);
        if (!$mail_sent) {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'error', $redirect_url));
            exit;
        }

        $pending = rueckenwinde_lead_get_pending();
        $pending[$token] = array(
            'email'             => $email,
            'consent'           => 1,
            'created_at'        => current_time('mysql'),
            'redirect_url'      => $redirect_url,
            'pdf_url'           => $pdf_url,
            'pdf_label'         => $pdf_label,
            'delivery_subject'  => $delivery_subject,
            'delivery_body'     => $delivery_body,
        );
        update_option('rueckenwinde_lead_pending', $pending, false);

        wp_safe_redirect(add_query_arg('rw_lead_status', 'check_email', $redirect_url));
        exit;
    }
}
add_action('admin_post_nopriv_rueckenwinde_lead_capture_submit', 'rueckenwinde_lead_capture_submit');
add_action('admin_post_rueckenwinde_lead_capture_submit', 'rueckenwinde_lead_capture_submit');

if (!function_exists('rueckenwinde_lead_capture_confirm')) {
    function rueckenwinde_lead_capture_confirm() {
        if (!isset($_GET['rw_lead_confirm']) || !isset($_GET['token'])) {
            return;
        }

        $token = sanitize_text_field(wp_unslash($_GET['token']));
        if ($token === '') {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', home_url('/')));
            exit;
        }

        $pending = rueckenwinde_lead_get_pending();
        if (!isset($pending[$token]) || !is_array($pending[$token])) {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', home_url('/')));
            exit;
        }

        $entry = $pending[$token];
        $email = isset($entry['email']) ? sanitize_email($entry['email']) : '';
        $redirect_url = isset($entry['redirect_url']) ? esc_url_raw($entry['redirect_url']) : home_url('/');
        $redirect_url = wp_validate_redirect($redirect_url, home_url('/'));
        $pdf_url = isset($entry['pdf_url']) ? esc_url_raw($entry['pdf_url']) : '';
        $pdf_label = isset($entry['pdf_label']) ? sanitize_text_field($entry['pdf_label']) : 'Jetzt PDF herunterladen';
        $delivery_subject = isset($entry['delivery_subject']) ? sanitize_text_field($entry['delivery_subject']) : 'Hier ist dein PDF';
        $delivery_body = isset($entry['delivery_body']) ? sanitize_textarea_field($entry['delivery_body']) : "Super, deine Anmeldung ist bestaetigt. Hier ist dein PDF:\n\n{{pdf_url}}\n\nViel Erfolg bei deiner Planung!";

        if (!is_email($email)) {
            unset($pending[$token]);
            update_option('rueckenwinde_lead_pending', $pending, false);
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', $redirect_url));
            exit;
        }

        $confirmed = rueckenwinde_lead_get_confirmed();
        $confirmed[] = array(
            'email'        => $email,
            'consent'      => 1,
            'confirmed_at' => current_time('mysql'),
            'source'       => $redirect_url,
        );
        update_option('rueckenwinde_lead_confirmed', $confirmed, false);

        unset($pending[$token]);
        update_option('rueckenwinde_lead_pending', $pending, false);

        rueckenwinde_lead_send_pdf_email($email, $delivery_subject, $delivery_body, $pdf_url, $pdf_label);

        wp_safe_redirect(add_query_arg('rw_lead_status', 'confirmed', $redirect_url));
        exit;
    }
}
add_action('init', 'rueckenwinde_lead_capture_confirm');

if (!function_exists('rueckenwinde_leads_get_admin_url')) {
    function rueckenwinde_leads_get_admin_url($args = array()) {
        return add_query_arg($args, admin_url('admin.php?page=rueckenwinde-leads'));
    }
}

if (!function_exists('rueckenwinde_leads_find_confirmed_index_by_email')) {
    function rueckenwinde_leads_find_confirmed_index_by_email($email, $confirmed) {
        $email = strtolower(trim((string) $email));
        if ($email === '' || !is_array($confirmed)) {
            return -1;
        }
        foreach ($confirmed as $idx => $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            if (strtolower((string) $entry['email']) === $email) {
                return (int) $idx;
            }
        }
        return -1;
    }
}

if (!function_exists('rueckenwinde_leads_find_pending_token_by_email')) {
    function rueckenwinde_leads_find_pending_token_by_email($email, $pending) {
        $email = strtolower(trim((string) $email));
        if ($email === '' || !is_array($pending)) {
            return '';
        }
        foreach ($pending as $token => $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            if (strtolower((string) $entry['email']) === $email) {
                return (string) $token;
            }
        }
        return '';
    }
}

if (!function_exists('rueckenwinde_leads_admin_export_csv')) {
    function rueckenwinde_leads_admin_export_csv() {
        if (!current_user_can('manage_options')) {
            wp_die('Keine Berechtigung.');
        }
        check_admin_referer('rueckenwinde_leads_export_csv');

        $pending = rueckenwinde_lead_get_pending();
        $confirmed = rueckenwinde_lead_get_confirmed();

        nocache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="rueckenwinde-leads-' . gmdate('Y-m-d') . '.csv"');

        $out = fopen('php://output', 'w');
        if (!$out) {
            wp_die('CSV konnte nicht erstellt werden.');
        }

        fputcsv($out, array('email', 'status', 'created_at', 'confirmed_at', 'source'));

        foreach ($confirmed as $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            fputcsv($out, array(
                sanitize_email($entry['email']),
                'confirmed',
                '',
                isset($entry['confirmed_at']) ? sanitize_text_field($entry['confirmed_at']) : '',
                isset($entry['source']) ? esc_url_raw($entry['source']) : '',
            ));
        }

        foreach ($pending as $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            fputcsv($out, array(
                sanitize_email($entry['email']),
                'pending',
                isset($entry['created_at']) ? sanitize_text_field($entry['created_at']) : '',
                '',
                isset($entry['redirect_url']) ? esc_url_raw($entry['redirect_url']) : '',
            ));
        }

        fclose($out);
        exit;
    }
}
add_action('admin_post_rueckenwinde_leads_export_csv', 'rueckenwinde_leads_admin_export_csv');

if (!function_exists('rueckenwinde_leads_admin_delete_one')) {
    function rueckenwinde_leads_admin_delete_one() {
        if (!current_user_can('manage_options')) {
            wp_die('Keine Berechtigung.');
        }
        check_admin_referer('rueckenwinde_leads_delete_one');

        $email = isset($_GET['email']) ? sanitize_email(wp_unslash($_GET['email'])) : '';
        $status = isset($_GET['lead_status']) ? sanitize_key(wp_unslash($_GET['lead_status'])) : '';
        $redirect = rueckenwinde_leads_get_admin_url();

        if (!is_email($email) || ($status !== 'confirmed' && $status !== 'pending')) {
            wp_safe_redirect(add_query_arg('notice', 'invalid', $redirect));
            exit;
        }

        if ($status === 'confirmed') {
            $confirmed = rueckenwinde_lead_get_confirmed();
            $idx = rueckenwinde_leads_find_confirmed_index_by_email($email, $confirmed);
            if ($idx >= 0) {
                array_splice($confirmed, $idx, 1);
                update_option('rueckenwinde_lead_confirmed', $confirmed, false);
            }
        } else {
            $pending = rueckenwinde_lead_get_pending();
            $token = rueckenwinde_leads_find_pending_token_by_email($email, $pending);
            if ($token !== '' && isset($pending[$token])) {
                unset($pending[$token]);
                update_option('rueckenwinde_lead_pending', $pending, false);
            }
        }

        wp_safe_redirect(add_query_arg('notice', 'deleted', $redirect));
        exit;
    }
}
add_action('admin_post_rueckenwinde_leads_delete_one', 'rueckenwinde_leads_admin_delete_one');

if (!function_exists('rueckenwinde_leads_admin_delete_all')) {
    function rueckenwinde_leads_admin_delete_all() {
        if (!current_user_can('manage_options')) {
            wp_die('Keine Berechtigung.');
        }
        check_admin_referer('rueckenwinde_leads_delete_all');

        update_option('rueckenwinde_lead_confirmed', array(), false);
        update_option('rueckenwinde_lead_pending', array(), false);

        wp_safe_redirect(add_query_arg('notice', 'deleted_all', rueckenwinde_leads_get_admin_url()));
        exit;
    }
}
add_action('admin_post_rueckenwinde_leads_delete_all', 'rueckenwinde_leads_admin_delete_all');

add_action('admin_menu', 'rueckenwinde_leads_add_admin_page');
function rueckenwinde_leads_add_admin_page() {
    add_menu_page(
        'Rueckenwinde Leads',
        'Leads',
        'manage_options',
        'rueckenwinde-leads',
        'rueckenwinde_leads_render_page',
        'dashicons-email-alt',
        59
    );
}

function rueckenwinde_leads_render_page() {
    if (!current_user_can('manage_options')) {
        wp_die('Keine Berechtigung.');
    }

    $pending = rueckenwinde_lead_get_pending();
    $confirmed = rueckenwinde_lead_get_confirmed();
    $notice = isset($_GET['notice']) ? sanitize_key(wp_unslash($_GET['notice'])) : '';
    ?>
    <div class="wrap">
        <h1>Rueckenwinde Leads</h1>

        <?php if ($notice === 'deleted') : ?>
            <div class="notice notice-success is-dismissible"><p>Kontakt wurde geloescht.</p></div>
        <?php elseif ($notice === 'deleted_all') : ?>
            <div class="notice notice-success is-dismissible"><p>Alle Kontakte wurden geloescht.</p></div>
        <?php elseif ($notice === 'invalid') : ?>
            <div class="notice notice-error is-dismissible"><p>Ungueltige Anfrage.</p></div>
        <?php endif; ?>

        <p>
            <a class="button button-primary" href="<?php echo esc_url(wp_nonce_url(admin_url('admin-post.php?action=rueckenwinde_leads_export_csv'), 'rueckenwinde_leads_export_csv')); ?>">CSV exportieren</a>
            <a class="button button-secondary" href="<?php echo esc_url(wp_nonce_url(admin_url('admin-post.php?action=rueckenwinde_leads_delete_all'), 'rueckenwinde_leads_delete_all')); ?>" onclick="return confirm('Wirklich alle Leads loeschen?');">Alle loeschen</a>
        </p>

        <h2>Bestaetigt (<?php echo esc_html((string) count($confirmed)); ?>)</h2>
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>E-Mail</th>
                    <th>Bestaetigt am</th>
                    <th>Quelle</th>
                    <th>Aktion</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($confirmed)) : ?>
                    <tr><td colspan="4">Keine bestaetigten Kontakte vorhanden.</td></tr>
                <?php else : ?>
                    <?php foreach ($confirmed as $entry) : ?>
                        <?php
                        $email = isset($entry['email']) ? sanitize_email($entry['email']) : '';
                        if ($email === '') {
                            continue;
                        }
                        $confirmed_at = isset($entry['confirmed_at']) ? sanitize_text_field($entry['confirmed_at']) : '';
                        $source = isset($entry['source']) ? esc_url_raw($entry['source']) : '';
                        $delete_url = wp_nonce_url(
                            add_query_arg(
                                array(
                                    'action'      => 'rueckenwinde_leads_delete_one',
                                    'lead_status' => 'confirmed',
                                    'email'       => $email,
                                ),
                                admin_url('admin-post.php')
                            ),
                            'rueckenwinde_leads_delete_one'
                        );
                        ?>
                        <tr>
                            <td><?php echo esc_html($email); ?></td>
                            <td><?php echo esc_html($confirmed_at); ?></td>
                            <td>
                                <?php if ($source !== '') : ?>
                                    <a href="<?php echo esc_url($source); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($source); ?></a>
                                <?php endif; ?>
                            </td>
                            <td><a class="button button-link-delete" href="<?php echo esc_url($delete_url); ?>" onclick="return confirm('Kontakt loeschen?');">Loeschen</a></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>

        <h2 style="margin-top:24px;">Pending (<?php echo esc_html((string) count($pending)); ?>)</h2>
        <table class="widefat striped">
            <thead>
                <tr>
                    <th>E-Mail</th>
                    <th>Angelegt am</th>
                    <th>Quelle</th>
                    <th>Aktion</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($pending)) : ?>
                    <tr><td colspan="4">Keine offenen Kontakte vorhanden.</td></tr>
                <?php else : ?>
                    <?php foreach ($pending as $entry) : ?>
                        <?php
                        if (!is_array($entry)) {
                            continue;
                        }
                        $email = isset($entry['email']) ? sanitize_email($entry['email']) : '';
                        if ($email === '') {
                            continue;
                        }
                        $created_at = isset($entry['created_at']) ? sanitize_text_field($entry['created_at']) : '';
                        $source = isset($entry['redirect_url']) ? esc_url_raw($entry['redirect_url']) : '';
                        $delete_url = wp_nonce_url(
                            add_query_arg(
                                array(
                                    'action'      => 'rueckenwinde_leads_delete_one',
                                    'lead_status' => 'pending',
                                    'email'       => $email,
                                ),
                                admin_url('admin-post.php')
                            ),
                            'rueckenwinde_leads_delete_one'
                        );
                        ?>
                        <tr>
                            <td><?php echo esc_html($email); ?></td>
                            <td><?php echo esc_html($created_at); ?></td>
                            <td>
                                <?php if ($source !== '') : ?>
                                    <a href="<?php echo esc_url($source); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($source); ?></a>
                                <?php endif; ?>
                            </td>
                            <td><a class="button button-link-delete" href="<?php echo esc_url($delete_url); ?>" onclick="return confirm('Kontakt loeschen?');">Loeschen</a></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}
