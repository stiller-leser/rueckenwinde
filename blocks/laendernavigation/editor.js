/**
 * Laendernavigation Block - Editor
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, TextControl, Disabled } = wp.components;
    const { __ } = wp.i18n;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    registerBlockType('rueckenwinde/laendernavigation', {
        title: __('Laendernavigation', 'rueckenwinde'),
        icon: 'leftright',
        category: 'widgets',
        description: __('Navigation im CPT Land: links zur Übersicht, rechts zum nächsten Eintrag.', 'rueckenwinde'),
        keywords: [__('laender', 'rueckenwinde'), __('navigation', 'rueckenwinde'), __('land', 'rueckenwinde')],

        attributes: {
            overviewLabel: {
                type: 'string',
                default: '>> ZUR UEBERSICHT'
            },
            overviewUrl: {
                type: 'string',
                default: ''
            }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { overviewLabel, overviewUrl } = attributes;
            const blockProps = useBlockProps();

            return el(
                'div',
                blockProps,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: __('Navigation', 'rueckenwinde'), initialOpen: true },
                        el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                            __('Link-Text (links)', 'rueckenwinde')
                        ),
                        el(RichText, {
                            tagName: 'div',
                            value: overviewLabel,
                            allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                            onChange: function (value) {
                                setAttributes({ overviewLabel: value });
                            },
                            placeholder: __('>> ZUR UEBERSICHT', 'rueckenwinde')
                        }),
                        el(TextControl, {
                            label: __('Link-URL (links)', 'rueckenwinde'),
                            type: 'url',
                            value: overviewUrl,
                            onChange: function (value) {
                                setAttributes({ overviewUrl: value });
                            },
                            help: __('Komplette URL eingeben (z.B. https://...)', 'rueckenwinde')
                        })
                    )
                ),
                el(
                    Disabled,
                    null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/laendernavigation',
                        attributes: attributes,
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
