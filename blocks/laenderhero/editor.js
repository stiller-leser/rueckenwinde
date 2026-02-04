/**
 * WordPress Gutenberg Block Editor
 * Nutzt ServerSideRender - HTML nur in render.php!
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, Button, Disabled } = wp.components;
    const { __ } = wp.i18n;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    registerBlockType('rueckenwinde/country-hero', {
        title: __('Country Hero', 'rueckenwinde'),
        icon: 'location-alt',
        category: 'widgets',
        description: __('Ein Block zur Anzeige von Uruguay-Reiseinformationen für die Panamericana', 'rueckenwinde'),
        keywords: [__('uruguay', 'rueckenwinde'), __('panamericana', 'rueckenwinde'), __('reise', 'rueckenwinde')],
        
        attributes: {
            title: {
                type: 'string',
                default: 'Uruguay war unser Einstieg in die Panamericana – ruhig, überschaubar und perfekt, um anzukommen. Hier findest du alles zu unseren Erlebnissen und Learnings.'
            },
            imageSrc: {
                type: 'string',
                default: ''
            },
            imageAlt: {
                type: 'string',
                default: 'Uruguay Bild'
            },
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
            const { title, imageSrc, imageAlt, distance, days, difficulty, budget } = attributes;
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
                            { title: __('Inhalt', 'rueckenwinde'), initialOpen: true },
                            el(TextareaControl, {
                                label: __('Titel', 'rueckenwinde'),
                                value: title,
                                onChange: function (value) {
                                    setAttributes({ title: value });
                                },
                                rows: 3,
                                help: __('Der Haupttext des Blocks', 'rueckenwinde')
                            })
                        ),
                        el(
                            PanelBody,
                            { title: __('Statistiken', 'rueckenwinde'), initialOpen: true },
                            el(TextControl, {
                                label: __('Distanz', 'rueckenwinde'),
                                value: distance,
                                onChange: function (value) {
                                    setAttributes({ distance: value });
                                },
                                help: __('z.B. "2065 KM"', 'rueckenwinde')
                            }),
                            el(TextControl, {
                                label: __('Tage', 'rueckenwinde'),
                                value: days,
                                onChange: function (value) {
                                    setAttributes({ days: value });
                                },
                                help: __('z.B. "34 Tage"', 'rueckenwinde')
                            }),
                            el(TextControl, {
                                label: __('Vanlife-Faktor', 'rueckenwinde'),
                                value: difficulty,
                                onChange: function (value) {
                                    setAttributes({ difficulty: value });
                                },
                                help: __('z.B. "Easy", "Medium", "Hard"', 'rueckenwinde')
                            }),
                            el(TextControl, {
                                label: __('Budget', 'rueckenwinde'),
                                value: budget,
                                onChange: function (value) {
                                    setAttributes({ budget: value });
                                },
                                help: __('z.B. "€€€"', 'rueckenwinde')
                            })
                        ),
                        el(
                            PanelBody,
                            { title: __('Bild', 'rueckenwinde'), initialOpen: false },
                            el(
                                MediaUploadCheck,
                                null,
                                el(MediaUpload, {
                                    onSelect: function (media) {
                                        setAttributes({
                                            imageSrc: media.url,
                                            imageAlt: media.alt || 'Uruguay Bild'
                                        });
                                    },
                                    allowedTypes: ['image'],
                                    value: imageSrc,
                                    render: function (obj) {
                                        return el(
                                            'div',
                                            null,
                                            imageSrc && el('div', { style: { marginBottom: '10px' } },
                                                el('img', {
                                                    src: imageSrc,
                                                    alt: imageAlt,
                                                    style: { maxWidth: '100%', height: 'auto' }
                                                })
                                            ),
                                            el(Button, {
                                                onClick: obj.open,
                                                variant: 'primary'
                                            }, imageSrc ? __('Bild ändern', 'rueckenwinde') : __('Bild auswählen', 'rueckenwinde')),
                                            imageSrc && el(Button, {
                                                onClick: function () {
                                                    setAttributes({ imageSrc: '', imageAlt: '' });
                                                },
                                                variant: 'secondary',
                                                isDestructive: true,
                                                style: { marginLeft: '10px' }
                                            }, __('Bild entfernen', 'rueckenwinde'))
                                        );
                                    }
                                })
                            ),
                            el(TextControl, {
                                label: __('Alt-Text', 'rueckenwinde'),
                                value: imageAlt,
                                onChange: function (value) {
                                    setAttributes({ imageAlt: value });
                                },
                                help: __('Beschreibung für Screenreader', 'rueckenwinde'),
                                style: { marginTop: '15px' }
                            })
                        )
                    ),
                    el(
                        Disabled,
                        null,
                        el(ServerSideRender, {
                            block: 'rueckenwinde/country-hero',
                            attributes: attributes
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
