(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, TextControl, Button, SelectControl, RangeControl, Disabled } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    function ensureSections(sections) {
        return Array.isArray(sections) ? sections : [];
    }

    function createId(prefix) {
        return prefix + '-' + String(Date.now()) + '-' + String(Math.floor(Math.random() * 10000));
    }

    function sectionTypeLabel(type) {
        if (type === 'text') return 'Text';
        if (type === 'photo') return 'Foto / GIF';
        if (type === 'highlight_day') return 'Highlight des Tages';
        if (type === 'highlight_week') return 'Highlight der Woche';
        if (type === 'spot_week') return 'Stellplatz der Woche';
        return 'Abschnitt';
    }

    registerBlockType('rueckenwinde/tagebuchseite', {
        edit: function (props) {
            const blockProps = useBlockProps({ className: 'tagebuchseite-editor-root' });
            const { attributes, setAttributes } = props;
            const sections = ensureSections(attributes.sections);

            function setSection(index, patch) {
                const next = sections.slice();
                next[index] = Object.assign({}, next[index], patch);
                setAttributes({ sections: next });
            }

            function removeSection(index) {
                const next = sections.slice();
                next.splice(index, 1);
                setAttributes({ sections: next });
            }

            function moveSection(index, direction) {
                const target = index + direction;
                if (target < 0 || target >= sections.length) {
                    return;
                }
                const next = sections.slice();
                const temp = next[index];
                next[index] = next[target];
                next[target] = temp;
                setAttributes({ sections: next });
            }

            function addSection(type) {
                const base = {
                    id: createId(type),
                    type: type,
                    title: '',
                    text: ''
                };
                if (type === 'photo') {
                    base.mediaUrl = '';
                    base.mediaAlt = '';
                    base.frameStyle = 'tape';
                    base.layout = 'full';
                    base.photoWidth = 100;
                    base.frameHeight = 320;
                    base.frameShiftX = 0;
                    base.frameShiftY = 0;
                    base.zoom = 100;
                    base.offsetX = 0;
                    base.offsetY = 0;
                }
                if (type === 'highlight_day') {
                    base.title = 'Highlight des Tages';
                }
                if (type === 'highlight_week') {
                    base.title = 'Highlight der Woche';
                }
                if (type === 'spot_week') {
                    base.title = 'Stellplatz der Woche';
                }
                setAttributes({ sections: sections.concat([base]) });
            }

            return el(
                'div',
                blockProps,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: 'Kopfbereich', initialOpen: true },
                        el(TextControl, {
                            label: 'Datum',
                            value: attributes.entryDate || '',
                            onChange: function (value) {
                                setAttributes({ entryDate: value });
                            },
                            placeholder: 'z. B. 25. Februar 2026'
                        }),
                        el(TextControl, {
                            label: 'Titel',
                            value: attributes.entryTitle || '',
                            onChange: function (value) {
                                setAttributes({ entryTitle: value });
                            },
                            placeholder: 'Unser Tag in ...'
                        })
                    )
                ),

                el('div', { className: 'tagebuchseite-editor-builder' },
                    el('div', { className: 'tagebuchseite-editor-addrow' },
                        el('span', { className: 'tagebuchseite-editor-addlabel' }, 'Abschnitt hinzufuegen:'),
                        el(Button, { variant: 'secondary', onClick: function () { addSection('text'); } }, 'Text'),
                        el(Button, { variant: 'secondary', onClick: function () { addSection('photo'); } }, 'Foto / GIF'),
                        el(Button, { variant: 'secondary', onClick: function () { addSection('highlight_day'); } }, 'Highlight Tag'),
                        el(Button, { variant: 'secondary', onClick: function () { addSection('highlight_week'); } }, 'Highlight Woche'),
                        el(Button, { variant: 'secondary', onClick: function () { addSection('spot_week'); } }, 'Stellplatz')
                    ),

                    sections.map(function (section, index) {
                        const isPhoto = section.type === 'photo';

                        return el('div', { key: section.id || String(index), className: 'tagebuchseite-editor-section' },
                            el('div', { className: 'tagebuchseite-editor-section-head' },
                                el('strong', null, sectionTypeLabel(section.type)),
                                el('div', { className: 'tagebuchseite-editor-actions' },
                                    el(Button, { variant: 'tertiary', onClick: function () { moveSection(index, -1); } }, 'Hoch'),
                                    el(Button, { variant: 'tertiary', onClick: function () { moveSection(index, 1); } }, 'Runter'),
                                    el(Button, { variant: 'link', isDestructive: true, onClick: function () { removeSection(index); } }, 'Loeschen')
                                )
                            ),

                            el(TextControl, {
                                label: 'Titel',
                                value: section.title || '',
                                onChange: function (value) {
                                    setSection(index, { title: value });
                                }
                            }),

                            el('label', { className: 'tagebuchseite-editor-label' }, 'Text'),
                            el(RichText, {
                                tagName: 'div',
                                className: 'tagebuchseite-editor-richtext',
                                value: section.text || '',
                                allowedFormats: ['core/bold', 'core/italic', 'core/link'],
                                onChange: function (value) {
                                    setSection(index, { text: value });
                                },
                                placeholder: 'Erzaehlt eure Erlebnisse ...'
                            }),

                            isPhoto && el('div', { className: 'tagebuchseite-editor-photo' },
                                el(MediaUploadCheck, null,
                                    el(MediaUpload, {
                                        onSelect: function (media) {
                                            setSection(index, {
                                                mediaUrl: media.url || '',
                                                mediaAlt: media.alt || ''
                                            });
                                        },
                                        allowedTypes: ['image'],
                                        value: section.mediaUrl || '',
                                        render: function (obj) {
                                            return el('div', null,
                                                section.mediaUrl && el('img', {
                                                    src: section.mediaUrl,
                                                    alt: section.mediaAlt || '',
                                                    className: 'tagebuchseite-editor-thumb'
                                                }),
                                                el(Button, { variant: 'secondary', onClick: obj.open }, section.mediaUrl ? 'Foto/GIF aendern' : 'Foto/GIF auswaehlen'),
                                                section.mediaUrl && el(Button, {
                                                    variant: 'link',
                                                    isDestructive: true,
                                                    onClick: function () {
                                                        setSection(index, { mediaUrl: '', mediaAlt: '' });
                                                    }
                                                }, 'Entfernen')
                                            );
                                        }
                                    })
                                ),
                                el(TextControl, {
                                    label: 'Alt-Text',
                                    value: section.mediaAlt || '',
                                    onChange: function (value) {
                                        setSection(index, { mediaAlt: value });
                                    }
                                }),
                                el(SelectControl, {
                                    label: 'Foto-Rahmen',
                                    value: section.frameStyle || 'tape',
                                    options: [
                                        { label: 'Klebeband', value: 'tape' },
                                        { label: '4 Fotoecken', value: 'corners' }
                                    ],
                                    onChange: function (value) {
                                        setSection(index, { frameStyle: value });
                                    }
                                }),
                                el(SelectControl, {
                                    label: 'Foto-Layout',
                                    value: section.layout || 'full',
                                    options: [
                                        { label: 'Volle Breite', value: 'full' },
                                        { label: 'Foto links', value: 'left' },
                                        { label: 'Foto rechts', value: 'right' },
                                        { label: 'Im Text links', value: 'inline_left' },
                                        { label: 'Im Text rechts', value: 'inline_right' }
                                    ],
                                    onChange: function (value) {
                                        setSection(index, { layout: value });
                                    }
                                }),
                                el(RangeControl, {
                                    label: 'Foto-Breite (%)',
                                    value: Number.isFinite(Number(section.photoWidth)) ? Number(section.photoWidth) : 100,
                                    min: 20,
                                    max: 100,
                                    step: 1,
                                    onChange: function (value) {
                                        setSection(index, { photoWidth: value || 100 });
                                    }
                                }),
                                el(RangeControl, {
                                    label: 'Rahmenhoehe',
                                    value: Number.isFinite(Number(section.frameHeight)) ? Number(section.frameHeight) : 320,
                                    min: 160,
                                    max: 700,
                                    step: 10,
                                    onChange: function (value) {
                                        setSection(index, { frameHeight: value || 320 });
                                    }
                                }),
                                el(RangeControl, {
                                    label: 'Foto-Rahmen horizontal verschieben',
                                    value: Number.isFinite(Number(section.frameShiftX)) ? Number(section.frameShiftX) : 0,
                                    min: -260,
                                    max: 260,
                                    step: 1,
                                    onChange: function (value) {
                                        setSection(index, { frameShiftX: value || 0 });
                                    }
                                }),
                                el(RangeControl, {
                                    label: 'Foto-Rahmen vertikal verschieben',
                                    value: Number.isFinite(Number(section.frameShiftY)) ? Number(section.frameShiftY) : 0,
                                    min: -260,
                                    max: 260,
                                    step: 1,
                                    onChange: function (value) {
                                        setSection(index, { frameShiftY: value || 0 });
                                    }
                                }),
                                el(RangeControl, {
                                    label: 'Foto-Groesse (Zoom %)',
                                    value: Number.isFinite(Number(section.zoom)) ? Number(section.zoom) : 100,
                                    min: 50,
                                    max: 220,
                                    step: 1,
                                    onChange: function (value) {
                                        setSection(index, { zoom: value || 100 });
                                    }
                                }),
                                el(RangeControl, {
                                    label: 'Foto horizontal verschieben',
                                    value: Number.isFinite(Number(section.offsetX)) ? Number(section.offsetX) : 0,
                                    min: -300,
                                    max: 300,
                                    step: 1,
                                    onChange: function (value) {
                                        setSection(index, { offsetX: value || 0 });
                                    }
                                }),
                                el(RangeControl, {
                                    label: 'Foto vertikal verschieben',
                                    value: Number.isFinite(Number(section.offsetY)) ? Number(section.offsetY) : 0,
                                    min: -300,
                                    max: 300,
                                    step: 1,
                                    onChange: function (value) {
                                        setSection(index, { offsetY: value || 0 });
                                    }
                                })
                            )
                        );
                    })
                ),

                el(
                    Disabled,
                    null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/tagebuchseite',
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
