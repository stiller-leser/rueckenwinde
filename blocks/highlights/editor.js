/**
 * Highlights Hero Block - Editor
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, Button, Disabled } = wp.components;
    const { __ } = wp.i18n;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;
    const Fragment = wp.element.Fragment;

    registerBlockType('rueckenwinde/highlights-hero', {
        title: __('Highlights Hero', 'rueckenwinde'),
        icon: 'star-filled',
        category: 'widgets',
        description: __('Highlights-Sektion mit drei Bildern und Link', 'rueckenwinde'),
        keywords: [__('highlights', 'rueckenwinde'), __('hero', 'rueckenwinde'), __('bilder', 'rueckenwinde')],

        attributes: {
            heading: {
                type: 'string',
                default: 'UNSERE HIGHLIGHTS'
            },
            image1Src: {
                type: 'string',
                default: ''
            },
            image1Alt: {
                type: 'string',
                default: 'Highlight 1'
            },
            image2Src: {
                type: 'string',
                default: ''
            },
            image2Alt: {
                type: 'string',
                default: 'Highlight 2'
            },
            image3Src: {
                type: 'string',
                default: ''
            },
            image3Alt: {
                type: 'string',
                default: 'Highlight 3'
            },
            image1Url: {
                type: 'string',
                default: ''
            },
            image1Label: {
                type: 'string',
                default: ''
            },
            image2Url: {
                type: 'string',
                default: ''
            },
            image2Label: {
                type: 'string',
                default: ''
            },
            image3Url: {
                type: 'string',
                default: ''
            },
            image3Label: {
                type: 'string',
                default: ''
            }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { 
                heading,
                image1Src, image1Alt, image1Url, image1Label,
                image2Src, image2Alt, image2Url, image2Label,
                image3Src, image3Alt, image3Url, image3Label
            } = attributes;
            const blockProps = useBlockProps();

            // Helper function für Media Upload Button
            function createMediaControl(imageSrc, imageAlt, onSelect, onRemove, label) {
                return el(
                    'div',
                    { style: { marginBottom: '20px' } },
                    el('label', { style: { display: 'block', marginBottom: '5px', fontWeight: 'bold' } }, label),
                    imageSrc && el('div', { style: { marginBottom: '10px' } },
                        el('img', {
                            src: imageSrc,
                            alt: imageAlt,
                            style: { maxWidth: '100%', height: 'auto' }
                        })
                    ),
                    el(
                        MediaUploadCheck,
                        null,
                        el(MediaUpload, {
                            onSelect: onSelect,
                            allowedTypes: ['image'],
                            value: imageSrc,
                            render: function (obj) {
                                return el(
                                    Fragment,
                                    null,
                                    el(Button, {
                                        onClick: obj.open,
                                        variant: 'primary'
                                    }, imageSrc ? __('Bild ändern', 'rueckenwinde') : __('Bild auswählen', 'rueckenwinde')),
                                    imageSrc && el(Button, {
                                        onClick: onRemove,
                                        variant: 'secondary',
                                        isDestructive: true,
                                        style: { marginLeft: '10px' }
                                    }, __('Entfernen', 'rueckenwinde'))
                                );
                            }
                        })
                    )
                );
            }

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
                    // Bild 1
                    el(
                        PanelBody,
                        { title: __('Bild 1', 'rueckenwinde'), initialOpen: true },
                        createMediaControl(
                            image1Src,
                            image1Alt,
                            function (media) {
                                setAttributes({
                                    image1Src: media.url,
                                    image1Alt: media.alt || 'Highlight 1'
                                });
                            },
                            function () {
                                setAttributes({ image1Src: '', image1Alt: 'Highlight 1' });
                            },
                            __('Erstes Highlight-Bild', 'rueckenwinde')
                        ),
                        el(TextControl, {
                            label: __('Alt-Text', 'rueckenwinde'),
                            value: image1Alt,
                            onChange: function (value) {
                                setAttributes({ image1Alt: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Link-URL', 'rueckenwinde'),
                            type: 'url',
                            value: image1Url,
                            onChange: function (value) {
                                setAttributes({ image1Url: value });
                            },
                            help: __('URL für dieses Bild (optional)', 'rueckenwinde')
                        }),
                        el(TextControl, {
                            label: __('Label', 'rueckenwinde'),
                            value: image1Label,
                            onChange: function (value) {
                                setAttributes({ image1Label: value });
                            },
                            help: __('Kurzer Schriftzug unter dem Bild (optional)', 'rueckenwinde')
                        })
                    ),
                    // Bild 2
                    el(
                        PanelBody,
                        { title: __('Bild 2', 'rueckenwinde'), initialOpen: false },
                        createMediaControl(
                            image2Src,
                            image2Alt,
                            function (media) {
                                setAttributes({
                                    image2Src: media.url,
                                    image2Alt: media.alt || 'Highlight 2'
                                });
                            },
                            function () {
                                setAttributes({ image2Src: '', image2Alt: 'Highlight 2' });
                            },
                            __('Zweites Highlight-Bild', 'rueckenwinde')
                        ),
                        el(TextControl, {
                            label: __('Alt-Text', 'rueckenwinde'),
                            value: image2Alt,
                            onChange: function (value) {
                                setAttributes({ image2Alt: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Link-URL', 'rueckenwinde'),
                            type: 'url',
                            value: image2Url,
                            onChange: function (value) {
                                setAttributes({ image2Url: value });
                            },
                            help: __('URL für dieses Bild (optional)', 'rueckenwinde')
                        }),
                        el(TextControl, {
                            label: __('Label', 'rueckenwinde'),
                            value: image2Label,
                            onChange: function (value) {
                                setAttributes({ image2Label: value });
                            },
                            help: __('Kurzer Schriftzug unter dem Bild (optional)', 'rueckenwinde')
                        })
                    ),
                    // Bild 3
                    el(
                        PanelBody,
                        { title: __('Bild 3', 'rueckenwinde'), initialOpen: false },
                        createMediaControl(
                            image3Src,
                            image3Alt,
                            function (media) {
                                setAttributes({
                                    image3Src: media.url,
                                    image3Alt: media.alt || 'Highlight 3'
                                });
                            },
                            function () {
                                setAttributes({ image3Src: '', image3Alt: 'Highlight 3' });
                            },
                            __('Drittes Highlight-Bild', 'rueckenwinde')
                        ),
                        el(TextControl, {
                            label: __('Alt-Text', 'rueckenwinde'),
                            value: image3Alt,
                            onChange: function (value) {
                                setAttributes({ image3Alt: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Link-URL', 'rueckenwinde'),
                            type: 'url',
                            value: image3Url,
                            onChange: function (value) {
                                setAttributes({ image3Url: value });
                            },
                            help: __('URL für dieses Bild (optional)', 'rueckenwinde')
                        }),
                        el(TextControl, {
                            label: __('Label', 'rueckenwinde'),
                            value: image3Label,
                            onChange: function (value) {
                                setAttributes({ image3Label: value });
                            },
                            help: __('Kurzer Schriftzug unter dem Bild (optional)', 'rueckenwinde')
                        })
                    )
                ),
                // Preview via ServerSideRender
                el(
                    'div',
                    { className: 'wp-block-rueckenwinde-highlights-hero-editor' },
                    el(
                        Disabled,
                        null,
                        el(ServerSideRender, {
                            block: 'rueckenwinde/highlights-hero',
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
