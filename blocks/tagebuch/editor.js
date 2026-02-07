/**
 * WordPress Gutenberg Block Editor
 * Nutzt ServerSideRender - HTML nur in render.php!
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, TextControl, Button, Disabled } = wp.components;
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
                            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                                __('Überschrift', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: heading,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                                onChange: function (value) {
                                    setAttributes({ heading: value });
                                },
                                placeholder: __('Überschrift', 'rueckenwinde')
                            }),
                            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold', marginTop: '12px' } },
                                __('Text', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: body,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                                onChange: function (value) {
                                    setAttributes({ body: value });
                                },
                                placeholder: __('Text', 'rueckenwinde')
                            }),
                            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold', marginTop: '12px' } },
                                __('Link-Text', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: linkLabel,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                                onChange: function (value) {
                                    setAttributes({ linkLabel: value });
                                },
                                placeholder: __('>> ZUM TAGEBUCH', 'rueckenwinde')
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
