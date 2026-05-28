(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, Notice } = wp.components;
    const { Disabled } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    registerBlockType('rueckenwinde/panamericana-inarticle-shop-cta', {
        edit: function (props) {
            const attrs = props.attributes;
            const setAttributes = props.setAttributes;
            const blockProps = useBlockProps();

            return el('div', blockProps,
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Inhalt', initialOpen: true },
                        el(TextControl, {
                            label: 'Icon (Emoji oder Zeichen)',
                            value: attrs.icon || '',
                            onChange: function (value) { setAttributes({ icon: value }); }
                        }),
                        el(TextControl, {
                            label: 'Headline',
                            value: attrs.headline || '',
                            onChange: function (value) { setAttributes({ headline: value }); }
                        }),
                        el(TextareaControl, {
                            label: 'Text-Template',
                            help: 'Nutze [Dynamic_Country_Name] fuer das erkannte Land.',
                            value: attrs.textTemplate || '',
                            onChange: function (value) { setAttributes({ textTemplate: value }); }
                        }),
                        el(TextControl, {
                            label: 'Fallback-Land',
                            value: attrs.fallbackCountry || '',
                            onChange: function (value) { setAttributes({ fallbackCountry: value }); }
                        }),
                        el(TextControl, {
                            label: 'Button-Text',
                            value: attrs.buttonLabel || '',
                            onChange: function (value) { setAttributes({ buttonLabel: value }); }
                        }),
                        el(TextControl, {
                            label: 'Button-URL',
                            value: attrs.buttonUrl || '',
                            onChange: function (value) { setAttributes({ buttonUrl: value }); }
                        })
                    )
                ),
                el(Notice, { status: 'info', isDismissible: false }, 'Dieser Block wird in Panamericana-Artikeln automatisch nach dem ersten Drittel eingefuegt. Manuell eingefuegt hat er Prioritaet.'),
                el(Disabled, null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/panamericana-inarticle-shop-cta',
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
