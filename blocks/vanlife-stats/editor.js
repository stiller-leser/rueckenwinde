/**
 * WordPress Gutenberg Block Editor
 * Nutzt ServerSideRender - HTML nur in render.php!
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, TextControl, Disabled } = wp.components;
    const { __ } = wp.i18n;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    registerBlockType('rueckenwinde/vanlife-stats', {
        title: __('Vanlife Stats', 'rueckenwinde'),
        icon: 'chart-bar',
        category: 'widgets',
        description: __('Statistiken für Vanlife-Reise (Distanz, Tage, Vanlife-Faktor, Budget)', 'rueckenwinde'),
        keywords: [__('vanlife', 'rueckenwinde'), __('stats', 'rueckenwinde'), __('reise', 'rueckenwinde')],
        
        attributes: {
            distance: {
                type: 'string',
                default: '2065 KM'
            },
            days: {
                type: 'string',
                default: '34 Tage'
            },
            difficulty: {
                type: 'string',
                default: 'Easy'
            },
            budget: {
                type: 'string',
                default: '€€€'
            }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { distance, days, difficulty, budget } = attributes;
            const blockProps = useBlockProps();

            return el(
                'div',
                blockProps,
                el(
                    wp.element.Fragment,
                    null,
                    el(
                        InspectorControls,
                        null,
                        el(
                            PanelBody,
                            { title: __('Statistiken', 'rueckenwinde'), initialOpen: true },
                            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                                __('Distanz', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: distance,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough'],
                                onChange: function (value) {
                                    setAttributes({ distance: value });
                                },
                                placeholder: __('z.B. "2065 KM"', 'rueckenwinde')
                            }),
                            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                                __('Tage', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: days,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough'],
                                onChange: function (value) {
                                    setAttributes({ days: value });
                                },
                                placeholder: __('z.B. "34 Tage"', 'rueckenwinde')
                            }),
                            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                                __('Vanlife-Faktor', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: difficulty,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough'],
                                onChange: function (value) {
                                    setAttributes({ difficulty: value });
                                },
                                placeholder: __('z.B. "Easy", "Medium", "Hard"', 'rueckenwinde')
                            }),
                            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                                __('Budget', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: budget,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough'],
                                onChange: function (value) {
                                    setAttributes({ budget: value });
                                },
                                placeholder: __('z.B. "€€€"', 'rueckenwinde')
                            })
                        )
                    ),
                    el(
                        Disabled,
                        null,
                        el(ServerSideRender, {
                            block: 'rueckenwinde/vanlife-stats',
                            attributes: attributes,
                            httpMethod: 'POST'
                        })
                    )
                )
            );
        },

        save: function () {
            return null;
        }
    });
})(window.wp);
