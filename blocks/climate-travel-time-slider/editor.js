(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, Button, SelectControl } = wp.components;
    const { __ } = wp.i18n;
    const el = wp.element.createElement;
    const { useState } = wp.element;

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const POSITION_MIGRATION = {
        canada: { old: [47, 8], next: [27, 16] },
        usa: { old: [47, 15], next: [27, 24] },
        mexico: { old: [44, 24], next: [24, 33] },
        belize: { old: [48, 30], next: [25, 40] },
        guatemala: { old: [44, 31], next: [24, 41] },
        elsalvador: { old: [42, 33], next: [23, 42.5] },
        honduras: { old: [46, 33], next: [25.5, 41.5] },
        nicaragua: { old: [45, 36], next: [25.5, 44] },
        costarica: { old: [44, 39], next: [25.5, 46.5] },
        panama: { old: [47, 42], next: [27, 48.5] },
        colombia: { old: [50, 47], next: [30, 53] },
        ecuador: { old: [49, 53], next: [29, 58] },
        peru: { old: [51, 60], next: [31, 65] },
        bolivia: { old: [56, 67], next: [35, 70] },
        paraguay: { old: [60, 72], next: [37, 76] },
        brasil: { old: [66, 66], next: [41, 66] },
        chile: { old: [46, 74], next: [27, 75] },
        argentina: { old: [52, 82], next: [32, 82] },
        uruguay: { old: [58, 84], next: [36, 84] }
    };

    const DEFAULT_COUNTRIES = [
            {
                    "id": "canada",
                    "name": "Canada",
                    "summary": "Long winter season with snow and ice on many routes.",
                    "tip": "Prioritize summer windows for mountain roads and camps.",
                    "vanlife": "High in summer, low in winter",
                    "ratings": [
                            0,
                            0,
                            1,
                            1,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 27,
                    "y": 16
            },
            {
                    "id": "usa",
                    "name": "USA",
                    "summary": "Huge climate spread from snow belts to deserts.",
                    "tip": "Match route with season; avoid winter mountain crossings.",
                    "vanlife": "High with route planning",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 27,
                    "y": 24
            },
            {
                    "id": "mexico",
                    "name": "Mexico",
                    "summary": "Dry season generally better for road reliability.",
                    "tip": "In rainy months, allow extra buffer for mountain roads.",
                    "vanlife": "High",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 24,
                    "y": 33
            },
            {
                    "id": "belize",
                    "name": "Belize",
                    "summary": "Wet season can reduce comfort and traction.",
                    "tip": "Dry months are easier for slower overland travel.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25,
                    "y": 40
            },
            {
                    "id": "guatemala",
                    "name": "Guatemala",
                    "summary": "Mountain terrain plus rain can slow travel strongly.",
                    "tip": "Use daylight driving and conservative daily distances.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 24,
                    "y": 41
            },
            {
                    "id": "elsalvador",
                    "name": "El Salvador",
                    "summary": "Short distances, weather still impacts road comfort.",
                    "tip": "Dry months are simplest for quick overland crossings.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 23,
                    "y": 42.5
            },
            {
                    "id": "honduras",
                    "name": "Honduras",
                    "summary": "Rain and road quality changes can affect pace.",
                    "tip": "Plan shorter legs in rainy periods.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25.5,
                    "y": 41.5
            },
            {
                    "id": "nicaragua",
                    "name": "Nicaragua",
                    "summary": "Dry months are typically easiest for road travel.",
                    "tip": "In wet months, expect slower timing and more detours.",
                    "vanlife": "High in dry season",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25.5,
                    "y": 44
            },
            {
                    "id": "costarica",
                    "name": "Costa Rica",
                    "summary": "Rainy season can heavily impact driving comfort.",
                    "tip": "Best flow often in drier months with stable roads.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25.5,
                    "y": 46.5
            },
            {
                    "id": "panama",
                    "name": "Panama",
                    "summary": "Strong wet season; route pacing matters.",
                    "tip": "Prioritize dry months for smoother transfers.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 27,
                    "y": 48.5
            },
            {
                    "id": "colombia",
                    "name": "Colombia",
                    "summary": "Conditions vary by altitude and region.",
                    "tip": "Combine weather check with route-specific road intel.",
                    "vanlife": "Moderate to high",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            2,
                            2
                    ],
                    "x": 30,
                    "y": 53
            },
            {
                    "id": "ecuador",
                    "name": "Ecuador",
                    "summary": "Mountain weather windows influence travel speed.",
                    "tip": "Keep flexible timing for highland rain and fog.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            1,
                            1,
                            0,
                            0,
                            0,
                            1,
                            1,
                            2,
                            2
                    ],
                    "x": 29,
                    "y": 58
            },
            {
                    "id": "peru",
                    "name": "Peru",
                    "summary": "Andean roads are sensitive to rain and landslides.",
                    "tip": "Dry periods are best for mountain and canyon sections.",
                    "vanlife": "High in dry season",
                    "ratings": [
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 31,
                    "y": 65
            },
            {
                    "id": "bolivia",
                    "name": "Bolivia",
                    "summary": "Altitude and rough roads require stable windows.",
                    "tip": "Aim for drier months and avoid extreme wet stretches.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 35,
                    "y": 70
            },
            {
                    "id": "paraguay",
                    "name": "Paraguay",
                    "summary": "Summer heat can be intense for long driving days.",
                    "tip": "Shoulder seasons are often easier for vanlife rhythm.",
                    "vanlife": "Moderate to high",
                    "ratings": [
                            1,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            1
                    ],
                    "x": 37,
                    "y": 76
            },
            {
                    "id": "brasil",
                    "name": "Brasil",
                    "summary": "Large regional contrasts in rain and road stress.",
                    "tip": "Select regional windows, not one national assumption.",
                    "vanlife": "Moderate",
                    "ratings": [
                            1,
                            1,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            1,
                            1
                    ],
                    "x": 41,
                    "y": 66
            },
            {
                    "id": "chile",
                    "name": "Chile",
                    "summary": "North-south span means very different driving seasons.",
                    "tip": "Use summer for southern routes and high passes.",
                    "vanlife": "High with timing",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 27,
                    "y": 75
            },
            {
                    "id": "argentina",
                    "name": "Argentina",
                    "summary": "Patagonia wind and seasonal extremes affect comfort.",
                    "tip": "Shoulder months can balance weather and road access.",
                    "vanlife": "High with route planning",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 32,
                    "y": 82
            },
            {
                    "id": "uruguay",
                    "name": "Uruguay",
                    "summary": "Stable roads but wetter and cooler winter periods.",
                    "tip": "Spring and autumn usually offer easiest driving rhythm.",
                    "vanlife": "High",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 36,
                    "y": 84
            }
    ];

    function sanitizeId(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'country';
    }

    function normalizeRatings(ratings) {
        const source = Array.isArray(ratings) ? ratings.slice(0, 12) : [];
        while (source.length < 12) {
            source.push(1);
        }

        return source.map(function (value) {
            const parsed = parseInt(value, 10);
            if (parsed < 0 || parsed > 2 || Number.isNaN(parsed)) {
                return 1;
            }
            return parsed;
        });
    }

    function parseRatingsText(value) {
        const parts = (value || '').split(',').map(function (part) {
            return part.trim();
        });
        return normalizeRatings(parts);
    }

    function ratingsToText(ratings) {
        return normalizeRatings(ratings).join(',');
    }

    function normalizeCountry(country, index) {
        const safe = country && typeof country === 'object' ? country : {};
        const name = typeof safe.name === 'string' && safe.name ? safe.name : ('Country ' + (index + 1));
        const id = typeof safe.id === 'string' && safe.id ? sanitizeId(safe.id) : sanitizeId(name);
        const migration = POSITION_MIGRATION[id];
        const oldX = typeof safe.x === 'number' ? safe.x : null;
        const oldY = typeof safe.y === 'number' ? safe.y : null;
        const matchesOld = migration &&
            oldX !== null && oldY !== null &&
            Math.abs(oldX - migration.old[0]) < 0.01 &&
            Math.abs(oldY - migration.old[1]) < 0.01;
        const resolvedX = matchesOld ? migration.next[0] : oldX;
        const resolvedY = matchesOld ? migration.next[1] : oldY;

        return {
            id: id,
            name: name,
            summary: typeof safe.summary === 'string' ? safe.summary : '',
            tip: typeof safe.tip === 'string' ? safe.tip : '',
            vanlife: typeof safe.vanlife === 'string' ? safe.vanlife : 'Moderate',
            ratings: normalizeRatings(safe.ratings),
            x: typeof resolvedX === 'number' ? Math.max(8, Math.min(92, resolvedX)) : 50,
            y: typeof resolvedY === 'number' ? Math.max(5, Math.min(95, resolvedY)) : (10 + index * 4)
        };
    }

    function normalizeCountries(countries) {
        const source = Array.isArray(countries) && countries.length ? countries : DEFAULT_COUNTRIES;
        return source.map(normalizeCountry);
    }

    registerBlockType('rueckenwinde/climate-travel-time-slider', {
        title: __('Climate & Travel Time Slider', 'rueckenwinde'),
        icon: 'location-alt',
        category: 'design',

        attributes: {
            heading: { type: 'string', default: 'Climate & Travel Time Slider' },
            intro: { type: 'string', default: 'Pick travel months and countries to compare road-focused travel conditions across the Panamericana.' },
            accentColor: { type: 'string', default: '#FFC400' },
            mapImageUrl: { type: 'string', default: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Americas_satellite_map.jpg' },
            countriesData: { type: 'array', default: DEFAULT_COUNTRIES }
        },

        edit: function (props) {
            const { attributes, setAttributes, isSelected } = props;
            const countries = normalizeCountries(attributes.countriesData);
            const blockProps = useBlockProps({ className: 'climate-slider-editor' });
            const [draggingIndex, setDraggingIndex] = useState(null);
            const [activeCountryId, setActiveCountryId] = useState(countries[0] ? countries[0].id : '');
            const [editorCountryId, setEditorCountryId] = useState(countries[0] ? countries[0].id : '');

            function updateCountry(index, changes) {
                const next = countries.slice();
                next[index] = Object.assign({}, next[index], changes);
                setAttributes({ countriesData: next });
            }

            function removeCountry(index) {
                setAttributes({
                    countriesData: countries.filter(function (_, i) {
                        return i !== index;
                    })
                });
            }

            function addCountry() {
                const i = countries.length + 1;
                setAttributes({
                    countriesData: countries.concat([{
                        id: 'country-' + i,
                        name: 'Country ' + i,
                        summary: '',
                        tip: '',
                        vanlife: 'Moderate',
                        ratings: [1,1,1,1,1,1,1,1,1,1,1,1],
                        x: 50,
                        y: Math.max(5, Math.min(95, 8 + i * 3))
                    }])
                });
            }

            function mapPointToPercent(evt, mapEl) {
                const rect = mapEl.getBoundingClientRect();
                const x = ((evt.clientX - rect.left) / rect.width) * 100;
                const y = ((evt.clientY - rect.top) / rect.height) * 100;
                return {
                    x: Math.max(8, Math.min(92, x)),
                    y: Math.max(5, Math.min(95, y))
                };
            }

            function moveCountryToPoint(index, evt, mapEl) {
                if (index === null || index < 0 || index >= countries.length) {
                    return;
                }
                const pos = mapPointToPercent(evt, mapEl);
                updateCountry(index, { x: Number(pos.x.toFixed(1)), y: Number(pos.y.toFixed(1)) });
            }

            function getActiveCountryIndex() {
                return countries.findIndex(function (country) {
                    return country.id === activeCountryId;
                });
            }

            const currentEditorIndex = countries.findIndex(function (country) {
                return country.id === editorCountryId;
            });
            const safeEditorIndex = currentEditorIndex === -1 ? 0 : currentEditorIndex;
            const editorCountry = countries[safeEditorIndex];

            if (!isSelected) {
                return el('div', blockProps,
                    el('div', { className: 'climate-slider-editor-collapsed' },
                        el('h3', null, attributes.heading || 'Climate & Travel Time Slider'),
                        el('p', null, attributes.intro || ''),
                        el('p', { className: 'climate-slider-editor-meta' }, countries.length + ' countries configured. Click block to edit.')
                    )
                );
            }

            return el('div', blockProps,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('General', 'rueckenwinde'), initialOpen: true },
                        el(TextControl, {
                            label: __('Heading', 'rueckenwinde'),
                            value: attributes.heading || '',
                            onChange: function (value) { setAttributes({ heading: value }); }
                        }),
                        el(TextareaControl, {
                            label: __('Intro', 'rueckenwinde'),
                            value: attributes.intro || '',
                            onChange: function (value) { setAttributes({ intro: value }); }
                        }),
                        el(TextControl, {
                            label: __('Accent color', 'rueckenwinde'),
                            value: attributes.accentColor || '#FFC400',
                            onChange: function (value) { setAttributes({ accentColor: value || '#FFC400' }); },
                            help: __('Hex value like #FFC400', 'rueckenwinde')
                        }),
                        el(TextControl, {
                            label: __('Map image URL', 'rueckenwinde'),
                            value: attributes.mapImageUrl || '',
                            onChange: function (value) { setAttributes({ mapImageUrl: value || '' }); },
                            help: __('Free image URL for North + South America background.', 'rueckenwinde')
                        })
                    )
                ),
                el('h3', null, attributes.heading || 'Climate & Travel Time Slider'),
                el('p', null, attributes.intro || ''),
                el('p', { className: 'climate-slider-editor-note' }, 'Edit monthly ratings as 12 values (0=red, 1=yellow, 2=green) in Jan-Dec order.'),
                el('div', { className: 'climate-editor-month-grid', 'aria-hidden': 'true' },
                    MONTHS.map(function (month) {
                        return el('span', { key: 'month-preview-' + month, className: 'climate-editor-month-box' }, month);
                    })
                ),
                el('div', { className: 'climate-editor-map-wrap' },
                    el('p', { className: 'climate-editor-map-help' }, 'Drag dots to reposition countries. Tip: click \"Focus on map\" and then click map to place exactly.'),
                    el('div', {
                            className: 'climate-editor-map',
                            style: {
                                '--climate-map-image': 'url(\"' + (attributes.mapImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/2/21/Americas_satellite_map.jpg') + '\")'
                            },
                            onMouseMove: function (evt) {
                                if (draggingIndex === null) {
                                    return;
                                }
                                moveCountryToPoint(draggingIndex, evt, evt.currentTarget);
                            },
                            onMouseUp: function () {
                                setDraggingIndex(null);
                            },
                            onMouseLeave: function () {
                                setDraggingIndex(null);
                            },
                            onClick: function (evt) {
                                const activeIndex = getActiveCountryIndex();
                                if (activeIndex === -1) {
                                    return;
                                }
                                moveCountryToPoint(activeIndex, evt, evt.currentTarget);
                            }
                        },
                        countries.map(function (country, index) {
                            const isActive = country.id === activeCountryId;
                            return el('button', {
                                    key: 'editor-dot-' + country.id + '-' + index,
                                    type: 'button',
                                    className: 'climate-editor-dot' + (isActive ? ' is-active' : ''),
                                    'data-country-id': country.id,
                                    style: { left: country.x + '%', top: country.y + '%' },
                                    onMouseDown: function (evt) {
                                        evt.preventDefault();
                                        setActiveCountryId(country.id);
                                        setEditorCountryId(country.id);
                                        setDraggingIndex(index);
                                    },
                                    onClick: function (evt) {
                                        evt.preventDefault();
                                        setActiveCountryId(country.id);
                                        setEditorCountryId(country.id);
                                    },
                                    title: country.name
                                },
                                el('span', { className: 'climate-editor-dot-core' }),
                                el('span', { className: 'climate-editor-dot-label' }, country.name)
                            );
                        })
                    )
                ),
                editorCountry && el('div', { className: 'climate-slider-country-card' },
                        el(SelectControl, {
                            label: 'Country to edit',
                            value: editorCountry.id,
                            options: countries.map(function (country) {
                                return { label: country.name, value: country.id };
                            }),
                            onChange: function (value) {
                                setEditorCountryId(value);
                                setActiveCountryId(value);
                            }
                        }),
                        el(TextControl, {
                            label: 'Country name',
                            value: editorCountry.name,
                            onChange: function (value) {
                                const nextId = sanitizeId(value);
                                updateCountry(safeEditorIndex, { name: value, id: nextId });
                                setEditorCountryId(nextId);
                                setActiveCountryId(nextId);
                            }
                        }),
                        el(TextControl, {
                            label: 'Country ID',
                            value: editorCountry.id,
                            onChange: function (value) {
                                const nextId = sanitizeId(value);
                                updateCountry(safeEditorIndex, { id: nextId });
                                setEditorCountryId(nextId);
                                setActiveCountryId(nextId);
                            },
                            help: 'Used internally for interactions.'
                        }),
                        el(TextareaControl, {
                            label: 'Climate / road summary',
                            value: editorCountry.summary,
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { summary: value });
                            }
                        }),
                        el(TextareaControl, {
                            label: 'Travel tip',
                            value: editorCountry.tip,
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { tip: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'Vanlife suitability text',
                            value: editorCountry.vanlife,
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { vanlife: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'Monthly ratings (12 values)',
                            value: ratingsToText(editorCountry.ratings),
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { ratings: parseRatingsText(value) });
                            },
                            help: MONTHS.join(', ') + ' = 0/1/2'
                        }),
                        el(TextControl, {
                            label: 'Map position X (%)',
                            value: String(editorCountry.x),
                            onChange: function (value) {
                                const parsed = parseFloat(value);
                                if (!Number.isNaN(parsed)) {
                                    updateCountry(safeEditorIndex, { x: Math.max(8, Math.min(92, parsed)) });
                                }
                            }
                        }),
                        el(TextControl, {
                            label: 'Map position Y (%)',
                            value: String(editorCountry.y),
                            onChange: function (value) {
                                const parsed = parseFloat(value);
                                if (!Number.isNaN(parsed)) {
                                    updateCountry(safeEditorIndex, { y: Math.max(5, Math.min(95, parsed)) });
                                }
                            }
                        }),
                        el(Button, {
                            variant: 'secondary',
                            onClick: function () { setActiveCountryId(editorCountry.id); }
                        }, 'Focus on map'),
                        el(Button, {
                            variant: 'secondary',
                            isDestructive: true,
                            onClick: function () { removeCountry(safeEditorIndex); }
                        }, 'Remove country')
                    ),
                el(Button, { variant: 'primary', onClick: addCountry }, 'Add country')
            );
        },

        save: function (props) {
            const attrs = props.attributes;
            const countries = normalizeCountries(attrs.countriesData);
            const mapImageUrl = attrs.mapImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/2/21/Americas_satellite_map.jpg';
            const blockProps = useBlockProps.save({
                className: 'wp-block-rueckenwinde-climate-travel-time-slider',
                style: {
                    '--climate-accent': attrs.accentColor || '#FFC400',
                    '--climate-map-image': 'url(\"' + mapImageUrl + '\")'
                },
                'data-countries': encodeURIComponent(JSON.stringify(countries))
            });

            return el('section', blockProps,
                el('div', { className: 'climate-slider-header' },
                    el('h3', { className: 'climate-slider-heading' }, attrs.heading || 'Climate & Travel Time Slider'),
                    el('p', { className: 'climate-slider-intro' }, attrs.intro || '')
                ),
                el('div', { className: 'climate-slider-layout' },
                    el('div', { className: 'climate-slider-map-panel' },
                        el('div', { className: 'climate-slider-map' },
                            countries.map(function (country) {
                                return el('button', {
                                        key: country.id,
                                        type: 'button',
                                        className: 'climate-country-node',
                                        'data-country-id': country.id,
                                        style: { left: country.x + '%', top: country.y + '%' },
                                        'aria-label': country.name
                                    },
                                    el('span', { className: 'climate-country-dot' }),
                                    el('span', { className: 'climate-country-name' }, country.name)
                                );
                            })
                        ),
                        el('div', { className: 'climate-slider-legend' },
                            el('span', { className: 'legend-item is-ideal' }, 'Ideal (road-friendly)'),
                            el('span', { className: 'legend-item is-moderate' }, 'Moderate'),
                            el('span', { className: 'legend-item is-poor' }, 'Not recommended')
                        ),
                        el('div', { className: 'climate-slider-tooltip', hidden: true })
                    ),
                    el('div', { className: 'climate-slider-controls' },
                        el('div', { className: 'climate-control-group' },
                            el('h4', null, 'Select month(s)'),
                            el('div', { className: 'climate-month-grid' },
                                MONTHS.map(function (month, idx) {
                                    return el('button', {
                                        key: month,
                                        type: 'button',
                                        className: 'climate-month-btn',
                                        'data-month-index': String(idx),
                                        'aria-pressed': 'false'
                                    }, month);
                                })
                            )
                        ),
                        el('div', { className: 'climate-control-group' },
                            el('h4', null, 'Select countries'),
                            el('div', { className: 'climate-country-list' },
                                countries.map(function (country) {
                                    const isDefaultChecked = country.id === 'uruguay';
                                    return el('label', { key: country.id, className: 'climate-country-item', 'data-country-row': country.id },
                                        el('input', {
                                            type: 'checkbox',
                                            className: 'climate-country-checkbox',
                                            'data-country-id': country.id,
                                            defaultChecked: isDefaultChecked
                                        }),
                                        el('span', { className: 'country-item-name' }, country.name),
                                        el('span', { className: 'country-item-state' }, 'Moderate')
                                    );
                                })
                            )
                        )
                    )
                )
            );
        }
    });
})(window.wp);
