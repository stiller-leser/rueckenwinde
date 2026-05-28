(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, Notice } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const { Disabled } = wp.components;
    const el = wp.element.createElement;

    registerBlockType('rueckenwinde/email-lead-pdf', {
        edit: function (props) {
            const attrs = props.attributes;
            const setAttributes = props.setAttributes;
            const blockProps = useBlockProps();

            return el('div', blockProps,
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Formular', initialOpen: true },
                        el(TextControl, { label: 'Titel', value: attrs.title || '', onChange: function (v) { setAttributes({ title: v }); } }),
                        el(TextareaControl, { label: 'Beschreibung', rows: 3, value: attrs.description || '', onChange: function (v) { setAttributes({ description: v }); } }),
                        el(TextControl, { label: 'E-Mail Placeholder', value: attrs.emailPlaceholder || '', onChange: function (v) { setAttributes({ emailPlaceholder: v }); } }),
                        el(TextareaControl, { label: 'Einwilligungstext', rows: 3, value: attrs.consentText || '', onChange: function (v) { setAttributes({ consentText: v }); } }),
                        el(TextControl, { label: 'Button Text', value: attrs.submitLabel || '', onChange: function (v) { setAttributes({ submitLabel: v }); } })
                    ),
                    el(PanelBody, { title: 'PDF', initialOpen: false },
                        el(TextControl, { label: 'PDF URL', value: attrs.pdfUrl || '', onChange: function (v) { setAttributes({ pdfUrl: v }); } }),
                        el(TextControl, { label: 'PDF Link Label', value: attrs.pdfLabel || '', onChange: function (v) { setAttributes({ pdfLabel: v }); } })
                    ),
                    el(PanelBody, { title: 'Double Opt-In E-Mails', initialOpen: false },
                        el(TextControl, { label: 'Bestaetigungs-Betreff', value: attrs.confirmSubject || '', onChange: function (v) { setAttributes({ confirmSubject: v }); } }),
                        el(TextareaControl, {
                            label: 'Bestaetigungs-Text',
                            help: 'Platzhalter: {{confirm_url}}',
                            rows: 5,
                            value: attrs.confirmBody || '',
                            onChange: function (v) { setAttributes({ confirmBody: v }); }
                        }),
                        el(TextControl, { label: 'PDF-Mail Betreff', value: attrs.deliverySubject || '', onChange: function (v) { setAttributes({ deliverySubject: v }); } }),
                        el(TextareaControl, {
                            label: 'PDF-Mail Text',
                            help: 'Platzhalter: {{pdf_url}}, {{pdf_label}}',
                            rows: 5,
                            value: attrs.deliveryBody || '',
                            onChange: function (v) { setAttributes({ deliveryBody: v }); }
                        })
                    ),
                    el(PanelBody, { title: 'Statusmeldungen', initialOpen: false },
                        el(TextControl, { label: 'Check-E-Mail Meldung', value: attrs.checkEmailMessage || '', onChange: function (v) { setAttributes({ checkEmailMessage: v }); } }),
                        el(TextControl, { label: 'Bestaetigt Meldung', value: attrs.confirmedMessage || '', onChange: function (v) { setAttributes({ confirmedMessage: v }); } }),
                        el(TextControl, { label: 'Schon bestaetigt Meldung', value: attrs.alreadyConfirmedMessage || '', onChange: function (v) { setAttributes({ alreadyConfirmedMessage: v }); } }),
                        el(TextControl, { label: 'Fehler Meldung', value: attrs.errorMessage || '', onChange: function (v) { setAttributes({ errorMessage: v }); } })
                    )
                ),
                el(Notice, { status: 'info', isDismissible: false }, 'Double Opt-In: Erst nach E-Mail-Bestaetigung wird der Kontakt als bestaetigt gespeichert.'),
                el(Disabled, null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/email-lead-pdf',
                        attributes: attrs,
                        httpMethod: 'POST'
                    })
                )
            );
        },
        save: function () {
            return null;
        }
    });
})(window.wp);
