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

    registerBlockType('rueckenwinde/tagebuch', {
        title: __('Tagebuch', 'rueckenwinde'),
        icon: 'book',
        category: 'widgets',
        description: __('Zweispaltiger Tagebuch-Teaser mit Text und Bild', 'rueckenwinde'),
        keywords: [__('tagebuch', 'rueckenwinde'), __('teaser', 'rueckenwinde'), __('gedanken', 'rueckenwinde')],
        
        attributes: {
            heading: {
                type: 'string',
                default: 'UNSERE GEDANKEN'
            },
            body: {
                type: 'string',
                default: ''
            },
            linkLabel: {
                type: 'string',
                default: '>> ZUM TAGEBUCH'
            },
            linkUrl: {
                type: 'string',
                default: ''
            },
            imageSrc: {
                type: 'string',
                default: ''
            },
            imageAlt: {
                type: 'string',
                default: 'Tagebuch Bild'
            }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { heading, body, linkLabel, linkUrl, imageSrc, imageAlt } = attributes;
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
                            el(TextControl, {
                                label: __('Überschrift', 'rueckenwinde'),
                                value: heading,
                                onChange: function (value) {
                                    setAttributes({ heading: value });
                                }
                            }),
                            el(TextareaControl, {
                                label: __('Text', 'rueckenwinde'),
                                value: body,
                                onChange: function (value) {
                                    setAttributes({ body: value });
                                },
                                rows: 6
                            }),
                            el(TextControl, {
                                label: __('Link-Text', 'rueckenwinde'),
                                value: linkLabel,
                                onChange: function (value) {
                                    setAttributes({ linkLabel: value });
                                }
                            }),
                            el(TextControl, {
                                label: __('Link-URL', 'rueckenwinde'),
                                value: linkUrl,
                                onChange: function (value) {
                                    setAttributes({ linkUrl: value });
                                }
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
                                            imageAlt: media.alt || 'Tagebuch Bild'
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
                                style: { marginTop: '15px' }
                            })
                        )
                    ),
                    el(
                        Disabled,
                        null,
                        el(ServerSideRender, {
                            block: 'rueckenwinde/tagebuch',
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
