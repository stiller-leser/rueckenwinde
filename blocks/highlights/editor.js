/**
 * Highlights Hero Block - Editor
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, TextControl, Button, Disabled } = wp.components;
    const { __ } = wp.i18n;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;
    const Fragment = wp.element.Fragment;
    const { useEffect } = wp.element;

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
            },
            images: {
                type: 'array',
                default: [
                    { src: '', alt: 'Highlight 1', url: '', label: '' },
                    { src: '', alt: 'Highlight 2', url: '', label: '' },
                    { src: '', alt: 'Highlight 3', url: '', label: '' }
                ]
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
                image1Src, image1Alt, image1Url, image1Label,
                image2Src, image2Alt, image2Url, image2Label,
                image3Src, image3Alt, image3Url, image3Label,
                images,
                linkText, linkUrl
            } = attributes;
            const blockProps = useBlockProps();

            const legacyImages = [
                { src: image1Src, alt: image1Alt, url: image1Url, label: image1Label },
                { src: image2Src, alt: image2Alt, url: image2Url, label: image2Label },
                { src: image3Src, alt: image3Alt, url: image3Url, label: image3Label }
            ];

            useEffect(function () {
                const hasLegacyContent = legacyImages.some(function (item) {
                    return item.src || item.url || item.label;
                });
                if ((!Array.isArray(images) || images.length === 0) && hasLegacyContent) {
                    setAttributes({ images: legacyImages });
                }
            }, [image1Src, image1Alt, image1Url, image1Label, image2Src, image2Alt, image2Url, image2Label, image3Src, image3Alt, image3Url, image3Label]);

            const currentImages = Array.isArray(images) && images.length ? images : legacyImages;

            function updateImage(index, updates) {
                const nextImages = currentImages.slice();
                const current = nextImages[index] || { src: '', alt: '', url: '', label: '' };
                nextImages[index] = Object.assign({}, current, updates);
                setAttributes({ images: nextImages });
            }

            function addImage() {
                setAttributes({
                    images: currentImages.concat([{ src: '', alt: 'Highlight', url: '', label: '' }])
                });
            }

            function removeImage(index) {
                const nextImages = currentImages.filter(function (_, i) {
                    return i !== index;
                });
                setAttributes({ images: nextImages });
            }

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
                        el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                            __('Hauptüberschrift', 'rueckenwinde')
                        ),
                        el(RichText, {
                            tagName: 'div',
                            value: heading,
                            allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                            onChange: function (value) {
                                setAttributes({ heading: value });
                            },
                            placeholder: __('Hauptüberschrift', 'rueckenwinde')
                        })
                    ),
                    // Bilder
                    el(
                        PanelBody,
                        { title: __('Bilder', 'rueckenwinde'), initialOpen: true },
                        currentImages.map(function (item, index) {
                            return el('div', { key: index, style: { marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e1e1e1' } },
                                createMediaControl(
                                    item.src,
                                    item.alt,
                                    function (media) {
                                        updateImage(index, {
                                            src: media.url,
                                            alt: media.alt || ('Highlight ' + (index + 1))
                                        });
                                    },
                                    function () {
                                        updateImage(index, { src: '', alt: 'Highlight ' + (index + 1) });
                                    },
                                    __('Highlight-Bild', 'rueckenwinde') + ' ' + (index + 1)
                                ),
                                el(TextControl, {
                                    label: __('Alt-Text', 'rueckenwinde'),
                                    value: item.alt || '',
                                    onChange: function (value) {
                                        updateImage(index, { alt: value });
                                    }
                                }),
                                el(TextControl, {
                                    label: __('Link-URL', 'rueckenwinde'),
                                    type: 'url',
                                    value: item.url || '',
                                    onChange: function (value) {
                                        updateImage(index, { url: value });
                                    },
                                    help: __('URL für dieses Bild (optional)', 'rueckenwinde')
                                }),
                                el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                                    __('Label', 'rueckenwinde')
                                ),
                                el(RichText, {
                                    tagName: 'div',
                                    value: item.label || '',
                                    allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                                    onChange: function (value) {
                                        updateImage(index, { label: value });
                                    },
                                    placeholder: __('Kurzer Schriftzug unter dem Bild (optional)', 'rueckenwinde')
                                }),
                                el(Button, {
                                    variant: 'secondary',
                                    isDestructive: true,
                                    onClick: function () {
                                        removeImage(index);
                                    },
                                    style: { marginTop: '10px' }
                                }, __('Bild entfernen', 'rueckenwinde'))
                            );
                        }),
                        el(Button, {
                            variant: 'primary',
                            onClick: addImage
                        }, __('Bild hinzufügen', 'rueckenwinde'))
                    ),
                    // Link
                    el(
                        PanelBody,
                        { title: __('Link', 'rueckenwinde'), initialOpen: false },
                        el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                            __('Link-Text', 'rueckenwinde')
                        ),
                        el(RichText, {
                            tagName: 'div',
                            value: linkText,
                            allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                            onChange: function (value) {
                                setAttributes({ linkText: value });
                            },
                            placeholder: __('>>WEITERLESEN [LINK]', 'rueckenwinde')
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
