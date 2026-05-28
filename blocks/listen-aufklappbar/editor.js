(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps } = wp.blockEditor;
    const { Button, TextControl, TextareaControl } = wp.components;
    const { __ } = wp.i18n;
    const el = wp.element.createElement;

    const DEFAULT_ITEMS = [
        {
            id: 'punkt-1',
            title: 'Listenpunkt 1',
            content: 'Hier steht der aufklappbare Inhalt.',
            imageUrl: '',
            linkUrl: '',
            linkLabel: ''
        },
        {
            id: 'punkt-2',
            title: 'Listenpunkt 2',
            content: 'Noch ein aufklappbarer Inhalt.',
            imageUrl: '',
            linkUrl: '',
            linkLabel: ''
        }
    ];

    function sanitizeId(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'punkt';
    }

    function normalizeItems(items) {
        const source = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;
        return source.map(function (item, index) {
            const safe = item && typeof item === 'object' ? item : {};
            const title = typeof safe.title === 'string' && safe.title ? safe.title : ('Listenpunkt ' + (index + 1));
            return {
                id: typeof safe.id === 'string' && safe.id ? safe.id : sanitizeId(title + '-' + (index + 1)),
                title: title,
                content: typeof safe.content === 'string' ? safe.content : '',
                imageUrl: typeof safe.imageUrl === 'string' ? safe.imageUrl : '',
                linkUrl: typeof safe.linkUrl === 'string' ? safe.linkUrl : '',
                linkLabel: typeof safe.linkLabel === 'string' ? safe.linkLabel : ''
            };
        });
    }

    function renderSaveMarkup(attrs, itemTag) {
        const items = normalizeItems(attrs.items);
        const blockProps = useBlockProps.save({ className: 'wp-block-rueckenwinde-listen-aufklappbar' });

        return el('section', blockProps,
            el('div', { className: 'lac-header' },
                el('h3', { className: 'lac-title' }, attrs.heading || 'Listen aufklappbar'),
                attrs.intro ? el('p', { className: 'lac-intro' }, attrs.intro) : null
            ),
            el('div', { className: 'lac-accordion' },
                items.map(function (item, index) {
                    const panelId = 'lac-panel-' + index;
                    return el(itemTag, { key: item.id || index, className: 'lac-item' },
                        el('button', {
                            type: 'button',
                            className: 'lac-trigger',
                            'aria-expanded': 'false',
                            'aria-controls': panelId
                        },
                            el('span', { className: 'lac-trigger-title' }, item.title || ('Listenpunkt ' + (index + 1)))
                        ),
                        el('div', { id: panelId, className: 'lac-panel', hidden: true },
                            item.content ? el('p', { className: 'lac-content' }, item.content) : null,
                            item.imageUrl ? el('figure', { className: 'lac-image-wrap' },
                                el('img', { className: 'lac-image', src: item.imageUrl, alt: item.title || '' })
                            ) : null,
                            item.linkUrl ? el('p', { className: 'lac-link-wrap' },
                                el('a', {
                                    className: 'lac-link',
                                    href: item.linkUrl,
                                    target: '_blank',
                                    rel: 'noopener noreferrer'
                                }, item.linkLabel || 'Mehr erfahren')
                            ) : null
                        )
                    );
                })
            )
        );
    }

    registerBlockType('rueckenwinde/listen-aufklappbar', {
        title: __('Listen aufklappbar', 'rueckenwinde'),
        icon: 'list-view',
        category: 'widgets',

        attributes: {
            heading: { type: 'string', default: 'Listen aufklappbar' },
            intro: { type: 'string', default: '' },
            items: { type: 'array', default: DEFAULT_ITEMS }
        },

        edit: function (props) {
            const { attributes, setAttributes, isSelected } = props;
            const blockProps = useBlockProps({ className: 'listen-aufklappbar-editor' });
            const items = normalizeItems(attributes.items);

            function updateItem(index, updates) {
                const next = items.slice();
                next[index] = Object.assign({}, next[index], updates);
                setAttributes({ items: next });
            }

            function addItem() {
                const i = items.length + 1;
                const fresh = {
                    id: 'punkt-' + i,
                    title: 'Listenpunkt ' + i,
                    content: '',
                    imageUrl: '',
                    linkUrl: '',
                    linkLabel: ''
                };
                setAttributes({ items: items.concat([fresh]) });
            }

            function removeItem(index) {
                setAttributes({
                    items: items.filter(function (_, i) { return i !== index; })
                });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= items.length || from === to) {
                    return;
                }
                const next = items.slice();
                const moved = next.splice(from, 1)[0];
                next.splice(to, 0, moved);
                setAttributes({ items: next });
            }

            if (!isSelected) {
                return el('section', blockProps,
                    el('h3', null, attributes.heading || 'Listen aufklappbar'),
                    el('p', { className: 'listen-aufklappbar-editor-compact' }, items.length + ' Punkte konfiguriert')
                );
            }

            return el('section', blockProps,
                el('h3', null, 'Listen aufklappbar (Editor)'),
                el(TextControl, {
                    label: 'Titel',
                    value: attributes.heading || '',
                    onChange: function (value) { setAttributes({ heading: value }); }
                }),
                el(TextareaControl, {
                    label: 'Einleitung (optional)',
                    value: attributes.intro || '',
                    onChange: function (value) { setAttributes({ intro: value }); }
                }),
                items.map(function (item, index) {
                    return el('div', { key: item.id || index, className: 'listen-aufklappbar-editor-card' },
                        el(TextControl, {
                            label: 'Titel Listenpunkt',
                            value: item.title,
                            onChange: function (value) {
                                updateItem(index, { title: value, id: sanitizeId(value || ('punkt-' + (index + 1))) });
                            }
                        }),
                        el(TextareaControl, {
                            label: 'Inhalt',
                            value: item.content,
                            onChange: function (value) { updateItem(index, { content: value }); }
                        }),
                        el(TextControl, {
                            label: 'Bild-URL (optional)',
                            value: item.imageUrl,
                            onChange: function (value) { updateItem(index, { imageUrl: value }); }
                        }),
                        el(TextControl, {
                            label: 'Link-URL (optional)',
                            value: item.linkUrl,
                            onChange: function (value) { updateItem(index, { linkUrl: value }); }
                        }),
                        el(TextControl, {
                            label: 'Link-Text (optional)',
                            value: item.linkLabel,
                            onChange: function (value) { updateItem(index, { linkLabel: value }); }
                        }),
                        el('div', { className: 'listen-aufklappbar-editor-actions' },
                            el(Button, {
                                variant: 'secondary',
                                onClick: function () { moveItem(index, index - 1); },
                                disabled: index === 0
                            }, 'Nach oben'),
                            el(Button, {
                                variant: 'secondary',
                                onClick: function () { moveItem(index, index + 1); },
                                disabled: index === items.length - 1
                            }, 'Nach unten'),
                            el(Button, {
                                variant: 'secondary',
                                isDestructive: true,
                                onClick: function () { removeItem(index); },
                                disabled: items.length <= 1
                            }, 'Punkt löschen')
                        )
                    );
                }),
                el(Button, { variant: 'primary', onClick: addItem }, 'Punkt hinzufügen')
            );
        },

        save: function (props) {
            return renderSaveMarkup(props.attributes, 'div');
        },

        deprecated: [
            {
                save: function (props) {
                    return renderSaveMarkup(props.attributes, 'article');
                }
            }
        ]
    });
})(window.wp);
