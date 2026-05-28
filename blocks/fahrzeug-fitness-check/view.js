(function () {
    const DEFAULT_PROFILES = [
        { id: 'usa-kanada-alaska', minClearance: 1, minRangeKm: 300, minCanLiters: 0, awdWeight: 'mittel', repairDemand: 'mittel' },
        { id: 'mexiko', minClearance: 1, minRangeKm: 300, minCanLiters: 0, awdWeight: 'niedrig', repairDemand: 'mittel' },
        { id: 'zentralamerika', minClearance: 1, minRangeKm: 250, minCanLiters: 0, awdWeight: 'niedrig', repairDemand: 'mittel' },
        { id: 'kolumbien-ecuador-peru', minClearance: 1, minRangeKm: 300, minCanLiters: 20, awdWeight: 'mittel', repairDemand: 'hoch' },
        { id: 'bolivien-lagunenroute', minClearance: 2, minRangeKm: 500, minCanLiters: 40, awdWeight: 'hoch', repairDemand: 'hoch' },
        { id: 'suedkegel', minClearance: 1, minRangeKm: 300, minCanLiters: 20, awdWeight: 'mittel', repairDemand: 'hoch' }
    ];

    const PRESET_VALUES = {
        awd: 'nein',
        clearance: '20to25',
        range: '400to600',
        cans: '20',
        repair: 'gut'
    };

    function toInt(value, fallback) {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    function normalizeProfile(profile, index) {
        const fallback = DEFAULT_PROFILES[index] || DEFAULT_PROFILES[0];
        const safe = profile && typeof profile === 'object' ? profile : {};
        const awdWeight = typeof safe.awdWeight === 'string' ? safe.awdWeight : fallback.awdWeight;
        const repairDemand = typeof safe.repairDemand === 'string' ? safe.repairDemand : fallback.repairDemand;

        return {
            id: typeof safe.id === 'string' && safe.id ? safe.id : fallback.id,
            minClearance: clamp(toInt(safe.minClearance, fallback.minClearance), 0, 2),
            minRangeKm: clamp(toInt(safe.minRangeKm, fallback.minRangeKm), 0, 650),
            minCanLiters: clamp(toInt(safe.minCanLiters, fallback.minCanLiters), 0, 40),
            awdWeight: awdWeight === 'hoch' || awdWeight === 'mittel' || awdWeight === 'niedrig' ? awdWeight : fallback.awdWeight,
            repairDemand: repairDemand === 'hoch' || repairDemand === 'mittel' ? repairDemand : fallback.repairDemand,
            presetException: typeof safe.presetException === 'string' ? safe.presetException : ''
        };
    }

    function normalizeProfiles(value) {
        const source = Array.isArray(value) && value.length ? value : DEFAULT_PROFILES;
        return source.map(normalizeProfile);
    }

    function parseProfiles(blockEl) {
        const raw = blockEl.getAttribute('data-country-profiles') || '';
        if (!raw) {
            return normalizeProfiles(DEFAULT_PROFILES);
        }
        try {
            const parsed = JSON.parse(decodeURIComponent(raw));
            return normalizeProfiles(parsed);
        } catch (err) {
            return normalizeProfiles(DEFAULT_PROFILES);
        }
    }

    function readVehicle(blockEl) {
        return {
            awd: (blockEl.querySelector('.ffc-input-awd') || {}).value || 'nein',
            clearance: (blockEl.querySelector('.ffc-input-clearance') || {}).value || '20to25',
            range: (blockEl.querySelector('.ffc-input-range') || {}).value || '400to600',
            cans: (blockEl.querySelector('.ffc-input-cans') || {}).value || '20',
            repair: (blockEl.querySelector('.ffc-input-repair') || {}).value || 'gut'
        };
    }

    function metricsFromVehicle(vehicle) {
        const clearanceMap = { lt20: 0, '20to25': 1, gt25: 2 };
        const rangeMap = { lt400: 350, '400to600': 500, gt600: 650 };
        const repairMap = { gut: 0, eingeschraenkt: 1, schwierig: 2 };
        return {
            awd: vehicle.awd,
            clearance: clearanceMap[vehicle.clearance] !== undefined ? clearanceMap[vehicle.clearance] : 1,
            rangeKm: rangeMap[vehicle.range] || 500,
            canLiters: parseInt(vehicle.cans, 10) || 0,
            repairLevel: repairMap[vehicle.repair] !== undefined ? repairMap[vehicle.repair] : 0
        };
    }

    function evaluateProfile(profile, metrics, presetActive) {
        if (presetActive) {
            return {
                state: 'green',
                label: '🟢 Gut geeignet',
                hints: ['Praxis-Setup aktiv: als erprobt eingestuft.']
            };
        }

        let critical = 0;
        let warnings = 0;
        const hints = [];

        if (metrics.clearance < profile.minClearance) {
            critical += 1;
            hints.push('Bodenfreiheit fuer diese Region zu gering.');
        }

        if (metrics.rangeKm < profile.minRangeKm) {
            const diff = profile.minRangeKm - metrics.rangeKm;
            if (profile.id === 'bolivien-lagunenroute' || diff >= 120) {
                critical += 1;
            } else {
                warnings += 1;
            }
            hints.push('Reichweite unter der empfohlenen Distanz.');
        }

        if (metrics.canLiters < profile.minCanLiters) {
            critical += 1;
            hints.push('Reservekanister unzureichend fuer diese Region.');
        }

        if (profile.awdWeight === 'hoch' && metrics.awd !== 'ja') {
            critical += 1;
            hints.push('Ohne Allrad in dieser Region deutlich erhoehtes Risiko.');
        } else if (profile.awdWeight === 'mittel' && metrics.awd !== 'ja') {
            warnings += 1;
            hints.push('Allrad waere hier ein klarer Vorteil.');
        }

        if (metrics.repairLevel === 2) {
            if (profile.repairDemand === 'hoch') {
                critical += 1;
                hints.push('Schwierige Reparierbarkeit in abgelegenen Gebieten kritisch.');
            } else {
                warnings += 1;
                hints.push('Ersatzteil- und Werkstattzugang kann Verzogerungen ausloesen.');
            }
        } else if (metrics.repairLevel === 1 && profile.repairDemand === 'hoch') {
            warnings += 1;
            hints.push('Bei Defekten sind Pufferzeit und Teileplanung wichtig.');
        }

        if (critical > 0) {
            return {
                state: 'red',
                label: '🔴 Kritisch / nicht empfohlen',
                hints: hints
            };
        }

        if (warnings >= 2) {
            return {
                state: 'yellow',
                label: '🟡 Machbar mit Anpassungen',
                hints: hints
            };
        }

        return {
            state: 'green',
            label: '🟢 Gut geeignet',
            hints: hints.length ? hints : ['Setup passt gut zu den regionalen Anforderungen.']
        };
    }

    function clearanceLabel(value) {
        if (value <= 0) {
            return '<20 cm';
        }
        if (value === 1) {
            return '20-25 cm';
        }
        return '>25 cm';
    }

    function awdLabel(value) {
        return value === 'ja' ? 'Ja' : 'Nein';
    }

    function statusClass(state) {
        if (state === 'green') {
            return 'ffc-status-green';
        }
        if (state === 'yellow') {
            return 'ffc-status-yellow';
        }
        if (state === 'red') {
            return 'ffc-status-red';
        }
        return 'ffc-status-neutral';
    }

    function setPresetState(blockEl, active) {
        const toggle = blockEl.querySelector('.ffc-preset-toggle');
        const badge = blockEl.querySelector('.ffc-preset-badge');
        const disclaimer = blockEl.querySelector('.ffc-preset-disclaimer');
        const controls = blockEl.querySelectorAll(
            '.ffc-input-awd, .ffc-input-clearance, .ffc-input-range, .ffc-input-cans, .ffc-input-repair'
        );

        if (toggle) {
            toggle.classList.toggle('is-active', active);
            toggle.setAttribute('aria-pressed', active ? 'true' : 'false');
        }
        if (badge) {
            badge.hidden = !active;
        }
        if (disclaimer) {
            disclaimer.hidden = !active;
        }

        controls.forEach(function (control) {
            const className = control.className || '';
            if (active) {
                if (className.indexOf('ffc-input-awd') !== -1) {
                    control.value = PRESET_VALUES.awd;
                } else if (className.indexOf('ffc-input-clearance') !== -1) {
                    control.value = PRESET_VALUES.clearance;
                } else if (className.indexOf('ffc-input-range') !== -1) {
                    control.value = PRESET_VALUES.range;
                } else if (className.indexOf('ffc-input-cans') !== -1) {
                    control.value = PRESET_VALUES.cans;
                } else if (className.indexOf('ffc-input-repair') !== -1) {
                    control.value = PRESET_VALUES.repair;
                }
            }
            control.disabled = active;
        });
    }

    function renderResults(blockEl, profiles, presetActive) {
        const vehicle = readVehicle(blockEl);
        const metrics = metricsFromVehicle(vehicle);
        const items = blockEl.querySelectorAll('.ffc-accordion-item');

        items.forEach(function (item) {
            const id = item.getAttribute('data-profile-id');
            const profile = profiles.find(function (candidate) {
                return candidate.id === id;
            });
            if (!profile) {
                return;
            }

            const result = evaluateProfile(profile, metrics, presetActive);
            const triggerStatus = item.querySelector('.ffc-trigger-status');
            const panelStatus = item.querySelector('.ffc-panel-status');
            const hintList = item.querySelector('.ffc-result-hints');
            const exception = item.querySelector('.ffc-preset-exception');
            const measureRange = item.querySelector('.ffc-measure-range');
            const measureCans = item.querySelector('.ffc-measure-cans');
            const measureClearance = item.querySelector('.ffc-measure-clearance');
            const measureAwd = item.querySelector('.ffc-measure-awd');
            let effectiveResult = result;

            if (presetActive && profile.presetException) {
                effectiveResult = {
                    state: 'red',
                    label: '🔴 Kritisch / nicht empfohlen',
                    hints: ['Preset-Ausnahme: Diese Teilregion bleibt kritisch.']
                };
            }

            [triggerStatus, panelStatus].forEach(function (node) {
                if (!node) {
                    return;
                }
                node.classList.remove('ffc-status-green', 'ffc-status-yellow', 'ffc-status-red', 'ffc-status-neutral');
                node.classList.add(statusClass(effectiveResult.state));
                node.textContent = effectiveResult.label;
            });

            if (hintList) {
                hintList.innerHTML = '';
                effectiveResult.hints.forEach(function (hint) {
                    const li = document.createElement('li');
                    li.textContent = hint;
                    hintList.appendChild(li);
                });
            }

            if (measureRange) {
                measureRange.textContent = 'Reichweite: ' + metrics.rangeKm + ' km (empfohlen: ' + profile.minRangeKm + '+ km)';
            }
            if (measureCans) {
                measureCans.textContent = 'Reservekanister: ' + metrics.canLiters + ' L (erforderlich: ' + profile.minCanLiters + '+ L)';
            }
            if (measureClearance) {
                measureClearance.textContent = 'Bodenfreiheit: ' + clearanceLabel(metrics.clearance) + ' (Mindestlevel: ' + clearanceLabel(profile.minClearance) + ')';
            }
            if (measureAwd) {
                measureAwd.textContent = 'Allrad: ' + awdLabel(metrics.awd) + ' (Relevanz: ' + (profile.awdWeight || '-') + ')';
            }

            if (exception) {
                exception.hidden = !presetActive;
            }
        });
    }

    function initAccordion(blockEl) {
        const triggers = blockEl.querySelectorAll('.ffc-accordion-trigger');
        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                const item = trigger.closest('.ffc-accordion-item');
                const panel = item ? item.querySelector('.ffc-accordion-panel') : null;
                if (!item || !panel) {
                    return;
                }
                const isOpen = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
                item.classList.toggle('is-open', !isOpen);
                panel.hidden = isOpen;
            });
        });
    }

    function initBlock(blockEl) {
        const profiles = parseProfiles(blockEl);
        if (!profiles.length) {
            return;
        }

        const accordion = blockEl.querySelector('.ffc-accordion');
        if (accordion) {
            accordion.classList.add('small-12', 'large-12', 'columns', 'cell');

            const parent = accordion.parentElement;
            const hasRowParent = parent && parent.classList && parent.classList.contains('row');
            if (!hasRowParent && parent) {
                const row = document.createElement('div');
                row.className = 'row';
                parent.insertBefore(row, accordion);
                row.appendChild(accordion);
            } else if (parent && parent.classList) {
                parent.classList.add('grid-x');
            }
        }

        let presetActive = false;

        const toggle = blockEl.querySelector('.ffc-preset-toggle');
        const evaluateButton = blockEl.querySelector('.ffc-evaluate');
        const inputs = blockEl.querySelectorAll('.ffc-input-grid select');

        function runEvaluation() {
            renderResults(blockEl, profiles, presetActive);
        }

        if (toggle) {
            toggle.addEventListener('click', function () {
                presetActive = !presetActive;
                setPresetState(blockEl, presetActive);
                runEvaluation();
            });
        }

        if (evaluateButton) {
            evaluateButton.addEventListener('click', runEvaluation);
        }

        inputs.forEach(function (input) {
            input.addEventListener('change', function () {
                runEvaluation();
            });
        });

        initAccordion(blockEl);
        setPresetState(blockEl, presetActive);
        runEvaluation();
    }

    function initAllBlocks() {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-fahrzeug-fitness-check');
        blocks.forEach(function (blockEl) {
            if (blockEl.getAttribute('data-ffc-initialized') === 'true') {
                return;
            }
            blockEl.setAttribute('data-ffc-initialized', 'true');
            initBlock(blockEl);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllBlocks);
    } else {
        initAllBlocks();
    }
})();
