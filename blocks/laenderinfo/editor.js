(function (wp) {
  if (!wp || !wp.blocks || !wp.element) {
    console.error('WordPress block editor APIs not available — rueckenwinde/laenderinfo will not be registered.');
    return;
  }

  var registerBlockType = wp.blocks.registerBlockType;
  var el = wp.element.createElement;
  var Fragment = wp.element.Fragment || null;
  var blockEditor = wp.blockEditor || wp.editor || {};
  var useBlockProps = blockEditor.useBlockProps || function () { return {}; };
  var InspectorControls = blockEditor.InspectorControls || null;
  var PanelBody = (wp.components && wp.components.PanelBody) || null;
  var TextControl = (wp.components && wp.components.TextControl) || null;

  registerBlockType('rueckenwinde/laenderinfo', {
    edit: function (props) {
      try {
        var attributes = props.attributes || {};
        var setAttributes = props.setAttributes || function () {};
        var bp = useBlockProps();

      var inspector = null;
      if (InspectorControls && PanelBody && TextControl) {
        inspector = el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: 'Länderinfo Einstellungen', initialOpen: true },
            el(TextControl, {
              label: 'Titel',
              value: attributes.title,
              onChange: function (value) {
                setAttributes({ title: value });
              }
            }),
            el(TextControl, {
              label: 'Visum',
              value: attributes.visum,
              onChange: function (value) {
                setAttributes({ visum: value });
              }
            }),
            el(TextControl, {
              label: 'Sprache',
              value: attributes.sprache,
              onChange: function (value) {
                setAttributes({ sprache: value });
              }
            }),
            el(TextControl, {
              label: 'Preisniveau',
              value: attributes.preisniveau,
              onChange: function (value) {
                setAttributes({ preisniveau: value });
              }
            }),
            el(TextControl, {
              label: 'Währung',
              value: attributes.waehrung,
              onChange: function (value) {
                setAttributes({ waehrung: value });
              }
            }),
            el(TextControl, {
              label: 'Beste Reisezeit',
              value: attributes.besteReisezeit,
              onChange: function (value) {
                setAttributes({ besteReisezeit: value });
              }
            }),
            el(TextControl, {
              label: 'Fortbewegung',
              value: attributes.fortbewegung,
              onChange: function (value) {
                setAttributes({ fortbewegung: value });
              }
            }),
            el(TextControl, {
              label: 'Adapter',
              value: attributes.adapter,
              onChange: function (value) {
                setAttributes({ adapter: value });
              }
            }),
            el(TextControl, {
              label: 'SIM-Karte',
              value: attributes.simkarte,
              onChange: function (value) {
                setAttributes({ simkarte: value });
              }
            })
          )
        );
      }

      var content = el(
        'div',
        bp,
        el(
          'div',
          { className: 'country-info-box wp-block-rueckenwinde-laenderinfo has-pale-cyan-blue-background-color has-background', style: { borderRadius: '8px', padding: '2rem' } },
          el('h2', null, attributes.title),
          el(
            'div',
            { className: 'wp-block-columns' },
            el(
              'div',
              { className: 'wp-block-column' },
              el('ul', null,
                el('li', null, '🛂 ', el('strong', null, 'Visum: '), attributes.visum),
                el('li', null, '💬 ', el('strong', null, 'Sprache: '), attributes.sprache),
                el('li', null, '🏷️ ', el('strong', null, 'Preisniveau: '), attributes.preisniveau),
                el('li', null, '💰 ', el('strong', null, 'Währung: '), attributes.waehrung)
              )
            ),
            el(
              'div',
              { className: 'wp-block-column' },
              el('ul', null,
                el('li', null, '☀️ ', el('strong', null, 'Beste Reisezeit: '), attributes.besteReisezeit),
                el('li', null, '🚘 ', el('strong', null, 'Fortbewegung: '), attributes.fortbewegung),
                el('li', null, '🔌 ', el('strong', null, 'Adapter: '), attributes.adapter),
                el('li', null, '📱 ', el('strong', null, 'SIM-Karte: '), attributes.simkarte)
              )
            )
          )
        )
      );

      return Fragment ? el(Fragment, null, inspector, content) : el('div', null, inspector, content);
      } catch (e) {
        console.error('rueckenwinde/laenderinfo block edit error:', e);
        return el('div', { className: 'rueckenwinde-block-error' }, el('strong', null, 'Block-Fehler: ' + (e && e.message ? e.message : 'Unbekannter Fehler')));
      }
    },
  });
})(window.wp);