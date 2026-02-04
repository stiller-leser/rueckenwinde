/**
 * Route Hero Block - Editor
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck, URLInput, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, Button, Disabled } = wp.components;
    const { __ } = wp.i18n;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    registerBlockType('rueckenwinde/route-hero', {
        title: __('Route Hero', 'rueckenwinde'),
        icon: 'location-alt',
        category: 'widgets',
        description: __('Route-Übersicht mit Bild und wichtigen Informationen', 'rueckenwinde'),
        keywords: [__('route', 'rueckenwinde'), __('hero', 'rueckenwinde'), __('reise', 'rueckenwinde')],

        attributes: {
            heading: {
                type: 'string',
                default: 'UNSERE ROUTE'
            },
            imageSrc: {
                type: 'string',
                default: ''
            },
            imageAlt: {
                type: 'string',
                default: 'Route Bild'
            },
            fillLabel: {
                type: 'string',
                default: 'Ausfüllen:'
            },
            startEnd: {
                type: 'string',
                default: 'Start -> Ende'
            },
            feeling: {
                type: 'string',
                default: 'Fahrgefühl'
            },
            climate: {
                type: 'string',
                default: 'Klima & Reisezeit'
            },
            linkText: {
                type: 'string',
                default: '>>WEITERLESEN [LINK]'
            },
            linkUrl: {
                type: 'string',
                default: ''
            }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { 
                heading, 
                imageSrc, 
                imageAlt, 
                fillLabel, 
                startEnd, 
                feeling, 
                climate, 
                linkText, 
                linkUrl 
            } = attributes;
            const blockProps = useBlockProps();


            return el(
                'div',
                blockProps,
                // Inspector Controls
                el(
                    InspectorControls,
                    null,
                    // Überschrift
                    el(
                        PanelBody,
                        { title: __('Überschrift', 'rueckenwinde'), initialOpen: true },
                        el(TextControl, {
                            label: __('Hauptüberschrift', 'rueckenwinde'),
                            value: heading,
                            onChange: function (value) {
                                setAttributes({ heading: value });
                            }
                        })
                    ),
                    // Bild
                    el(
                        PanelBody,
                        { title: __('Bild', 'rueckenwinde'), initialOpen: true },
                        el(
                            MediaUploadCheck,
                            null,
                            el(MediaUpload, {
                                onSelect: function (media) {
                                    setAttributes({
                                        imageSrc: media.url,
                                        imageAlt: media.alt || 'Route Bild'
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
                    ),
                    // Info-Felder
                    el(
                        PanelBody,
                        { title: __('Info-Felder', 'rueckenwinde'), initialOpen: true },
                        el(TextControl, {
                            label: __('Label (z.B. "Ausfüllen:")', 'rueckenwinde'),
                            value: fillLabel,
                            onChange: function (value) {
                                setAttributes({ fillLabel: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Start -> Ende', 'rueckenwinde'),
                            value: startEnd,
                            onChange: function (value) {
                                setAttributes({ startEnd: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Fahrgefühl', 'rueckenwinde'),
                            value: feeling,
                            onChange: function (value) {
                                setAttributes({ feeling: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Klima & Reisezeit', 'rueckenwinde'),
                            value: climate,
                            onChange: function (value) {
                                setAttributes({ climate: value });
                            }
                        })
                    ),
                    // Link
                    el(
                        PanelBody,
                        { title: __('Link', 'rueckenwinde'), initialOpen: false },
                        el(TextControl, {
                            label: __('Link-Text', 'rueckenwinde'),
                            value: linkText,
                            onChange: function (value) {
                                setAttributes({ linkText: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Link-URL', 'rueckenwinde'),
                            type: 'url',
                            value: linkUrl,
                            onChange: function (value) {
                                setAttributes({ linkUrl: value });
                            },
                            help: __('Komplette URL eingeben (z.B. https://...)', 'rueckenwinde')
                        })
                    )
                ),
                // Preview via ServerSideRender
                el(
                    Disabled,
                    null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/route-hero',
                        attributes: attributes
                    })
                )
            );
        },

        save: function () {
            return null;
        }
    });
})(window.wp);