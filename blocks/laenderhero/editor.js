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
            }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { title, imageSrc, imageAlt } = attributes;
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
                                __('Titel', 'rueckenwinde')
                            ),
                            el(RichText, {
                                tagName: 'div',
                                value: title,
                                allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                                onChange: function (value) {
                                    setAttributes({ title: value });
                                },
                                placeholder: __('Der Haupttext des Blocks', 'rueckenwinde')
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
