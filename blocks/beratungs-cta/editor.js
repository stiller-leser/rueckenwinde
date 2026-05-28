(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Disabled, Notice, PanelBody, TextControl, TextareaControl } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    registerBlockType('rueckenwinde/beratungs-cta', {
        edit: function (props) {
            const blockProps = useBlockProps();
            const attrs = props.attributes;
            const setAttributes = props.setAttributes;
            return el('div', blockProps,
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Inhalt', initialOpen: true },
                        el(TextControl, {
                            label: 'Headline',
                            value: attrs.headline || '',
                            onChange: function (value) { setAttributes({ headline: value }); }
                        }),
                        el(TextareaControl, {
                            label: 'Text',
                            rows: 4,
                            value: attrs.text || '',
                            onChange: function (value) { setAttributes({ text: value }); }
                        }),
                        el(TextControl, {
                            label: 'Bullet 1',
                            value: attrs.bulletTime || '',
                            onChange: function (value) { setAttributes({ bulletTime: value }); }
                        }),
                        el(TextControl, {
                            label: 'Bullet 2',
                            value: attrs.bulletSafety || '',
                            onChange: function (value) { setAttributes({ bulletSafety: value }); }
                        }),
                        el(TextControl, {
                            label: 'Bullet 3',
                            value: attrs.bulletContacts || '',
                            onChange: function (value) { setAttributes({ bulletContacts: value }); }
                        }),
                        el(TextControl, {
                            label: 'Button Text',
                            value: attrs.buttonLabel || '',
                            onChange: function (value) { setAttributes({ buttonLabel: value }); }
                        }),
                        el(TextControl, {
                            label: 'Button URL',
                            value: attrs.buttonUrl || '',
                            onChange: function (value) { setAttributes({ buttonUrl: value }); }
                        }),
                        el(TextControl, {
                            label: 'Profilbild URL',
                            value: attrs.profileImageUrl || '',
                            onChange: function (value) { setAttributes({ profileImageUrl: value }); }
                        })
                    )
                ),
                el(Notice, { status: 'info', isDismissible: false }, 'Du kannst alle Inhalte direkt im Block bearbeiten. Leere Felder nutzen die globalen Einstellungen als Fallback.'),
                el(Disabled, null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/beratungs-cta',
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
