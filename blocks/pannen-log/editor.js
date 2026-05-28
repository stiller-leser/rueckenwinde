(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, SelectControl, RangeControl, Button, Disabled } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const { useState, useEffect } = wp.element;
    const el = wp.element.createElement;

    const CATEGORY_OPTIONS = ['Technik', 'Grenze', 'Gesundheit', 'Buerokratie'];
    const FALLBACK_ENTRY = {
        category: 'Technik',
        title: 'Neue Panne',
        ort: '',
        problem: '',
        solution: '',
        stress: 5
    };

    function normalizeCategory(value) {
        return CATEGORY_OPTIONS.indexOf(value) !== -1 ? value : 'Technik';
    }

    function normalizeStress(value) {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            return 5;
        }
        return Math.max(1, Math.min(10, parsed));
    }

    function normalizeEntry(entry, index) {
        const safe = entry && typeof entry === 'object' ? entry : {};
        return {
            category: normalizeCategory(safe.category),
            title: typeof safe.title === 'string' && safe.title ? safe.title : ('Panne ' + (index + 1)),
            ort: typeof safe.ort === 'string' ? safe.ort : '',
            problem: typeof safe.problem === 'string' ? safe.problem : '',
            solution: typeof safe.solution === 'string' ? safe.solution : '',
            stress: normalizeStress(safe.stress)
        };
    }

    function normalizeEntries(entries) {
        if (!Array.isArray(entries) || !entries.length) {
            return [Object.assign({}, FALLBACK_ENTRY)];
        }
        return entries.map(normalizeEntry);
    }

    registerBlockType('rueckenwinde/pannen-log', {
        edit: function (props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const entries = normalizeEntries(attributes.entries);
            const [activeIndex, setActiveIndex] = useState(0);

            useEffect(function () {
                if (activeIndex > entries.length - 1) {
                    setActiveIndex(Math.max(0, entries.length - 1));
                }
            }, [activeIndex, entries.length]);

            const activeEntry = entries[activeIndex] || entries[0];

            function saveEntries(next) {
                setAttributes({ entries: next });
            }

            function updateEntry(index, changes) {
                const next = entries.slice();
                next[index] = Object.assign({}, next[index], changes);
                saveEntries(next);
            }

            function addEntry() {
                const next = entries.concat([normalizeEntry({}, entries.length)]);
                saveEntries(next);
                setActiveIndex(next.length - 1);
            }

            function duplicateEntry(index) {
                const clone = Object.assign({}, entries[index]);
                const next = entries.slice();
                next.splice(index + 1, 0, clone);
                saveEntries(next);
                setActiveIndex(index + 1);
            }

            function removeEntry(index) {
                if (entries.length <= 1) {
                    saveEntries([Object.assign({}, FALLBACK_ENTRY)]);
                    setActiveIndex(0);
                    return;
                }
                const next = entries.filter(function (_, i) {
                    return i !== index;
                });
                saveEntries(next);
                setActiveIndex(Math.max(0, index - 1));
            }

            function moveEntry(from, to) {
                if (to < 0 || to >= entries.length || from === to) {
                    return;
                }
                const next = entries.slice();
                const moved = next.splice(from, 1)[0];
                next.splice(to, 0, moved);
                saveEntries(next);
                setActiveIndex(to);
            }

            return el(
                'div',
                blockProps,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: 'Allgemein', initialOpen: true },
                        el(TextControl, {
                            label: 'Titel',
                            value: attributes.title || '',
                            onChange: function (value) {
                                setAttributes({ title: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'Untertitel',
                            value: attributes.subtitle || '',
                            onChange: function (value) {
                                setAttributes({ subtitle: value });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Kacheln', initialOpen: true },
                        el(SelectControl, {
                            label: 'Kachel auswaehlen',
                            value: String(activeIndex),
                            options: entries.map(function (entry, index) {
                                return {
                                    label: (index + 1) + '. ' + (entry.title || 'Unbenannt'),
                                    value: String(index)
                                };
                            }),
                            onChange: function (value) {
                                setActiveIndex(parseInt(value, 10) || 0);
                            }
                        }),
                        el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' } },
                            el(Button, {
                                variant: 'secondary',
                                onClick: addEntry
                            }, 'Neue Kachel'),
                            el(Button, {
                                variant: 'secondary',
                                onClick: function () {
                                    duplicateEntry(activeIndex);
                                }
                            }, 'Duplizieren'),
                            el(Button, {
                                variant: 'secondary',
                                onClick: function () {
                                    moveEntry(activeIndex, activeIndex - 1);
                                },
                                disabled: activeIndex === 0
                            }, 'Nach oben'),
                            el(Button, {
                                variant: 'secondary',
                                onClick: function () {
                                    moveEntry(activeIndex, activeIndex + 1);
                                },
                                disabled: activeIndex === entries.length - 1
                            }, 'Nach unten'),
                            el(Button, {
                                variant: 'tertiary',
                                isDestructive: true,
                                onClick: function () {
                                    removeEntry(activeIndex);
                                }
                            }, 'Loeschen')
                        ),
                        activeEntry && el(SelectControl, {
                            label: 'Kategorie',
                            value: activeEntry.category,
                            options: CATEGORY_OPTIONS.map(function (item) {
                                return { label: item, value: item };
                            }),
                            onChange: function (value) {
                                updateEntry(activeIndex, { category: normalizeCategory(value) });
                            }
                        }),
                        activeEntry && el(TextControl, {
                            label: 'Titel',
                            value: activeEntry.title,
                            onChange: function (value) {
                                updateEntry(activeIndex, { title: value });
                            }
                        }),
                        activeEntry && el(TextControl, {
                            label: 'Ort',
                            value: activeEntry.ort,
                            onChange: function (value) {
                                updateEntry(activeIndex, { ort: value });
                            }
                        }),
                        activeEntry && el(TextareaControl, {
                            label: 'Problem',
                            rows: 4,
                            value: activeEntry.problem,
                            onChange: function (value) {
                                updateEntry(activeIndex, { problem: value });
                            }
                        }),
                        activeEntry && el(TextareaControl, {
                            label: 'Loesung',
                            rows: 4,
                            value: activeEntry.solution,
                            onChange: function (value) {
                                updateEntry(activeIndex, { solution: value });
                            }
                        }),
                        activeEntry && el(RangeControl, {
                            label: 'Stress-Level',
                            min: 1,
                            max: 10,
                            value: activeEntry.stress,
                            onChange: function (value) {
                                updateEntry(activeIndex, { stress: normalizeStress(value) });
                            }
                        })
                    )
                ),
                el(
                    Disabled,
                    null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/pannen-log',
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
