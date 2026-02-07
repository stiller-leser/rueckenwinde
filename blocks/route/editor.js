/**
 * Route Hero Block - Editor
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck, URLInput, useBlockProps, RichText } = wp.blockEditor;
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
            listItems: {
                type: 'array',
                default: ['Start -> Ende', 'Fahrgefühl', 'Klima & Reisezeit']
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
                listItems,
                startEnd, 
                feeling, 
                climate, 
                linkText, 
                linkUrl 
            } = attributes;
            const blockProps = useBlockProps();

            const hasListItems = Array.isArray(listItems);
            const currentListItems = hasListItems ? listItems : [startEnd, feeling, climate];

            const updateListItem = function (index, value) {
                const nextItems = currentListItems.slice();
                nextItems[index] = value;
                setAttributes({ listItems: nextItems });
            };

            const addListItem = function () {
                setAttributes({ listItems: currentListItems.concat(['']) });
            };

            const removeListItem = function (index) {
                const nextItems = currentListItems.filter(function (_, i) {
                    return i !== index;
                });
                setAttributes({ listItems: nextItems });
            };

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
                        el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } },
                            __('Label (z.B. "Ausfüllen:")', 'rueckenwinde')
                        ),
                        el('div', { className: 'route-hero-list-editor' },
                            currentListItems.map(function (item, index) {
                                return el('div', { key: index, style: { marginBottom: '10px' } },
                                    el('div', { style: { marginBottom: '6px' } },
                                        el('strong', null, __('Listenelement', 'rueckenwinde') + ' ' + (index + 1))
                                    ),
                                    el(RichText, {
                                        tagName: 'div',
                                        value: item,
                                        allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                                        formattingControls: ['bold', 'italic', 'strikethrough', 'link'],
                                        onChange: function (value) {
                                            updateListItem(index, value);
                                        },
                                        placeholder: __('Listenpunkt hinzufügen', 'rueckenwinde')
                                    }),
                                    el('div', { style: { fontSize: '12px', color: '#666', marginTop: '4px' } },
                                        __('Tipp: Text markieren und Strg+B für fett. Alternativ <strong>Wort</strong>.', 'rueckenwinde')
                                    ),
                                    el(Button, {
                                        variant: 'secondary',
                                        isDestructive: true,
                                        onClick: function () {
                                            removeListItem(index);
                                        },
                                        style: { marginTop: '6px' }
                                    }, __('Entfernen', 'rueckenwinde'))
                                );
                            })
                        ),
                        el(Button, {
                            variant: 'primary',
                            onClick: addListItem
                        }, __('Listenelement hinzufügen', 'rueckenwinde'))
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
                    Disabled,
                    null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/route-hero',
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
