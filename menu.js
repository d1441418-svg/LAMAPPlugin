(function () {
    'use strict';

    if (window.lampa_glass_menu_plugin) return;
    window.lampa_glass_menu_plugin = true;

    var STORAGE_PREFIX = 'glass_menu_';

    var DEFAULTS = {
        enabled: true,
        blur: '18',
        opacity: '35',
        accent: 'cyan',
        floating: true,
        glass_head: true,
        glass_modals: true,
        compact_icons: false,
        hide_items: []
    };

    var ACCENTS = {
        cyan: {
            name: 'Неоновый циан (Cyber Cyan)',
            primary: '0, 229, 255',
            secondary: '0, 119, 255',
            hex: '#00e5ff'
        },
        purple: {
            name: 'Аметист (Neon Purple)',
            primary: '189, 0, 255',
            secondary: '112, 0, 255',
            hex: '#bd00ff'
        },
        emerald: {
            name: 'Изумруд (Emerald Glass)',
            primary: '0, 245, 160',
            secondary: '0, 180, 120',
            hex: '#00f5a0'
        },
        gold: {
            name: 'Золотой закат (Sunset Gold)',
            primary: '255, 184, 0',
            secondary: '255, 107, 0',
            hex: '#ffb800'
        },
        crimson: {
            name: 'Рубиновый неон (Crimson Glow)',
            primary: '255, 42, 109',
            secondary: '210, 0, 75',
            hex: '#ff2a6d'
        },
        white: {
            name: 'Чистый кристалл (Apple Glass)',
            primary: '255, 255, 255',
            secondary: '200, 215, 235',
            hex: '#ffffff'
        }
    };

    function getSetting(key) {
        return Lampa.Storage.get(STORAGE_PREFIX + key, DEFAULTS[key]);
    }

    function setSetting(key, value) {
        Lampa.Storage.set(STORAGE_PREFIX + key, value);
        applyGlassStyles();
        applyMenuVisibility();
    }

    function buildCSS() {
        if (!getSetting('enabled')) return '';

        var blurPx = parseInt(getSetting('blur'), 10) || 18;
        var opacityVal = (parseInt(getSetting('opacity'), 10) || 35) / 100;
        var accentKey = getSetting('accent') || 'cyan';
        var accent = ACCENTS[accentKey] || ACCENTS.cyan;
        var isFloating = getSetting('floating');
        var glassHead = getSetting('glass_head');
        var glassModals = getSetting('glass_modals');
        var compactIcons = getSetting('compact_icons');

        var itemOpacity = Math.min(opacityVal + 0.12, 0.85).toFixed(2);
        var panelBg = 'rgba(14, 18, 28, ' + opacityVal.toFixed(2) + ')';

        var css = [
            ':root {',
            '    --gm-blur: ' + blurPx + 'px;',
            '    --gm-bg: ' + panelBg + ';',
            '    --gm-item-bg: rgba(255, 255, 255, 0.04);',
            '    --gm-item-hover-bg: rgba(' + accent.primary + ', 0.16);',
            '    --gm-accent-rgb: ' + accent.primary + ';',
            '    --gm-accent-sec-rgb: ' + accent.secondary + ';',
            '    --gm-accent-hex: ' + accent.hex + ';',
            '    --gm-border: rgba(255, 255, 255, 0.12);',
            '    --gm-border-focus: rgba(' + accent.primary + ', 0.65);',
            '}',

            /* Главное боковое меню (контейнер) */
            '.menu {',
            '    transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease !important;',
            '}',

            '.wrap__left, .menu__content {',
            '    background: var(--gm-bg) !important;',
            '    backdrop-filter: blur(var(--gm-blur)) saturate(185%) !important;',
            '    -webkit-backdrop-filter: blur(var(--gm-blur)) saturate(185%) !important;',
            '    border-right: 1px solid var(--gm-border) !important;',
            '    box-shadow: 12px 0 40px rgba(0, 0, 0, 0.55), inset -1px 0 0 rgba(255, 255, 255, 0.06) !important;',
            '    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1) !important;',
            '}',

            /* Парящий режим меню (Floating Glass Dock) */
            isFloating ? [
                'body.menu--open .wrap__left, .wrap__left {',
                '    margin: 1.2em 0 1.2em 1.2em !important;',
                '    height: calc(100vh - 2.4em) !important;',
                '    border-radius: 1.4em !important;',
                '    border: 1px solid var(--gm-border) !important;',
                '    overflow: hidden !important;',
                '}'
            ].join('\n') : '',

            /* Список элементов меню */
            '.menu__list {',
            '    padding: 0.4em 0.6em !important;',
            '}',

            /* Разделительная линия между основной и дополнительной секцией */
            '.menu__split {',
            '    height: 1px !important;',
            '    margin: 0.8em 0.9em !important;',
            '    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;',
            '    border: none !important;',
            '}',

            /* Элементы меню */
            '.menu__item {',
            '    position: relative !important;',
            '    margin: 0.32em 0 !important;',
            '    padding: ' + (compactIcons ? '0.62em 0.95em' : '0.78em 1.1em') + ' !important;',
            '    border-radius: 0.95em !important;',
            '    background: var(--gm-item-bg) !important;',
            '    border: 1px solid rgba(255, 255, 255, 0.05) !important;',
            '    color: rgba(255, 255, 255, 0.78) !important;',
            '    transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),',
            '                background 0.26s ease,',
            '                border-color 0.26s ease,',
            '                box-shadow 0.26s ease,',
            '                color 0.26s ease !important;',
            '    overflow: hidden !important;',
            '}',

            /* Блик стекла внутри каждого пункта */
            '.menu__item::before {',
            '    content: "" !important;',
            '    position: absolute !important;',
            '    top: 0; left: 0; right: 0; bottom: 0 !important;',
            '    background: linear-gradient(125deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 100%) !important;',
            '    opacity: 0 !important;',
            '    transition: opacity 0.26s ease !important;',
            '    pointer-events: none !important;',
            '}',

            /* Боковой неоновый индикатор активного пункта */
            '.menu__item::after {',
            '    content: "" !important;',
            '    position: absolute !important;',
            '    left: 0.25em !important;',
            '    top: 50% !important;',
            '    transform: translateY(-50%) scaleY(0) !important;',
            '    width: 0.26em !important;',
            '    height: 56% !important;',
            '    border-radius: 1em !important;',
            '    background: linear-gradient(180deg, rgb(var(--gm-accent-rgb)), rgb(var(--gm-accent-sec-rgb))) !important;',
            '    box-shadow: 0 0 12px rgba(var(--gm-accent-rgb), 0.95) !important;',
            '    transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1) !important;',
            '}',

            /* Иконки меню */
            '.menu__ico {',
            '    margin-right: 0.95em !important;',
            '    transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.28s ease !important;',
            '    display: flex !important;',
            '    align-items: center !important;',
            '    justify-content: center !important;',
            '}',

            '.menu__ico svg, .menu__ico img {',
            '    width: 1.35em !important;',
            '    height: 1.35em !important;',
            '    opacity: 0.85 !important;',
            '    transition: all 0.28s ease !important;',
            '}',

            /* Текст пункта меню */
            '.menu__text {',
            '    font-weight: 500 !important;',
            '    letter-spacing: 0.015em !important;',
            '    transition: transform 0.26s ease, color 0.26s ease, text-shadow 0.26s ease !important;',
            '}',

            /* Состояние фокуса / наведения / выбора */
            '.menu__item.focus, .menu__item.traverse, .menu__item.hover, .menu__item:hover {',
            '    background: linear-gradient(135deg, rgba(var(--gm-accent-rgb), 0.24) 0%, rgba(var(--gm-accent-sec-rgb), 0.08) 100%) !important;',
            '    border-color: var(--gm-border-focus) !important;',
            '    color: #ffffff !important;',
            '    transform: translateX(0.38em) scale(1.02) !important;',
            '    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.5),',
            '                0 0 20px -2px rgba(var(--gm-accent-rgb), 0.35),',
            '                inset 0 1px 1px rgba(255, 255, 255, 0.28) !important;',
            '}',

            '.menu__item.focus::before, .menu__item.traverse::before, .menu__item.hover::before, .menu__item:hover::before {',
            '    opacity: 1 !important;',
            '}',

            '.menu__item.focus::after, .menu__item.traverse::after, .menu__item.hover::after, .menu__item:hover::after {',
            '    transform: translateY(-50%) scaleY(1) !important;',
            '}',

            '.menu__item.focus .menu__ico, .menu__item.traverse .menu__ico, .menu__item.hover .menu__ico, .menu__item:hover .menu__ico {',
            '    transform: scale(1.16) !important;',
            '    filter: drop-shadow(0 0 8px rgba(var(--gm-accent-rgb), 0.85)) !important;',
            '}',

            '.menu__item.focus .menu__ico svg, .menu__item.hover .menu__ico svg {',
            '    opacity: 1 !important;',
            '    fill: rgb(var(--gm-accent-rgb)) !important;',
            '}',

            '.menu__item.focus .menu__text, .menu__item.traverse .menu__text, .menu__item.hover .menu__text, .menu__item:hover .menu__text {',
            '    color: #ffffff !important;',
            '    font-weight: 600 !important;',
            '    transform: translateX(0.18em) !important;',
            '    text-shadow: 0 0 14px rgba(var(--gm-accent-rgb), 0.55) !important;',
            '}',

            /* Активный открытый раздел меню */
            '.menu__item.active {',
            '    background: rgba(var(--gm-accent-rgb), 0.12) !important;',
            '    border-color: rgba(var(--gm-accent-rgb), 0.32) !important;',
            '    color: #ffffff !important;',
            '}',

            /* Верхняя панель (Шапка / Head) в стиле жидкого стекла */
            glassHead ? [
                '.head__body {',
                '    background: rgba(14, 18, 28, ' + Math.max(opacityVal - 0.08, 0.15).toFixed(2) + ') !important;',
                '    backdrop-filter: blur(' + Math.round(blurPx * 0.85) + 'px) saturate(175%) !important;',
                '    -webkit-backdrop-filter: blur(' + Math.round(blurPx * 0.85) + 'px) saturate(175%) !important;',
                '    border-radius: 1.15em !important;',
                '    border: 1px solid rgba(255, 255, 255, 0.1) !important;',
                '    padding: 0.45em 1.1em !important;',
                '    margin: 0.4em 0.6em !important;',
                '    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;',
                '}',
                '.head__action {',
                '    border-radius: 0.75em !important;',
                '    background: rgba(255, 255, 255, 0.04) !important;',
                '    border: 1px solid rgba(255, 255, 255, 0.06) !important;',
                '    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1) !important;',
                '}',
                '.head__action.focus, .head__action.hover, .head__action:hover {',
                '    background: linear-gradient(135deg, rgba(var(--gm-accent-rgb), 0.28), rgba(var(--gm-accent-sec-rgb), 0.12)) !important;',
                '    border-color: var(--gm-border-focus) !important;',
                '    color: #ffffff !important;',
                '    transform: translateY(-2px) scale(1.06) !important;',
                '    box-shadow: 0 6px 18px rgba(var(--gm-accent-rgb), 0.35) !important;',
                '}'
            ].join('\n') : '',

            /* Модальные окна, панель настроек и выпадающие списки */
            glassModals ? [
                '.settings__content, .selectbox__content, .modal__content {',
                '    background: rgba(14, 18, 28, ' + itemOpacity + ') !important;',
                '    backdrop-filter: blur(' + (blurPx + 6) + 'px) saturate(190%) !important;',
                '    -webkit-backdrop-filter: blur(' + (blurPx + 6) + 'px) saturate(190%) !important;',
                '    border: 1px solid rgba(255, 255, 255, 0.14) !important;',
                '    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;',
                '}',
                '.modal__content {',
                '    border-radius: 1.4em !important;',
                '}',
                '.settings-param.focus, .selectbox-item.focus, .settings-folder.focus {',
                '    background: linear-gradient(90deg, rgba(var(--gm-accent-rgb), 0.22), rgba(var(--gm-accent-sec-rgb), 0.06)) !important;',
                '    border-radius: 0.75em !important;',
                '    box-shadow: inset 0 0 0 1px rgba(var(--gm-accent-rgb), 0.45) !important;',
                '}'
            ].join('\n') : ''
        ].join('\n');

        return css;
    }

    function applyGlassStyles() {
        var styleEl = document.getElementById('lampa-glass-menu-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'lampa-glass-menu-styles';
            styleEl.type = 'text/css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = buildCSS();
    }

    function applyMenuVisibility() {
        var hiddenActions = getSetting('hide_items') || [];
        if (!Array.isArray(hiddenActions)) hiddenActions = [];

        $('.menu__item').each(function () {
            var item = $(this);
            var action = item.attr('data-action') || '';
            var text = item.find('.menu__text').text().trim();
            if (action && hiddenActions.indexOf(action) !== -1) {
                item.hide();
            } else if (text && hiddenActions.indexOf(text) !== -1) {
                item.hide();
            } else {
                item.show();
            }
        });
    }

    function openHideItemsDialog() {
        var items = [];
        var hiddenActions = getSetting('hide_items') || [];
        if (!Array.isArray(hiddenActions)) hiddenActions = [];

        $('.menu__item').each(function () {
            var el = $(this);
            var text = el.find('.menu__text').text().trim();
            var action = el.attr('data-action') || text;
            if (!text) return;

            var isHidden = hiddenActions.indexOf(action) !== -1;
            items.push({
                title: text,
                value: action,
                checkbox: true,
                checked: isHidden
            });
        });

        if (!items.length) {
            Lampa.Noty.show('Пункты меню еще не загружены');
            return;
        }

        Lampa.Select.show({
            title: 'Скрыть пункты меню',
            items: items,
            onBack: function () {
                Lampa.Controller.toggle('settings_component');
            },
            onCheck: function (item) {
                var current = getSetting('hide_items') || [];
                if (!Array.isArray(current)) current = [];
                var idx = current.indexOf(item.value);

                if (item.checked && idx === -1) {
                    current.push(item.value);
                } else if (!item.checked && idx !== -1) {
                    current.splice(idx, 1);
                }
                setSetting('hide_items', current);
            }
        });
    }

    function registerSettings() {
        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: 'glass_menu',
            name: 'Стеклянное меню (Glass UI)',
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/><path d="M9 3V21" stroke="currentColor" stroke-width="2"/><path d="M13 8H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13 16H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'enabled',
                type: 'trigger',
                default: DEFAULTS.enabled
            },
            field: {
                name: 'Включить стеклянное меню',
                description: 'Активирует эффект матового стекла (Glassmorphism), неоновое свечение и плавные анимации'
            },
            onChange: function () {
                applyGlassStyles();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'accent',
                type: 'select',
                values: {
                    cyan: ACCENTS.cyan.name,
                    purple: ACCENTS.purple.name,
                    emerald: ACCENTS.emerald.name,
                    gold: ACCENTS.gold.name,
                    crimson: ACCENTS.crimson.name,
                    white: ACCENTS.white.name
                },
                default: DEFAULTS.accent
            },
            field: {
                name: 'Цветовой акцент свечения',
                description: 'Цвет подсветки активного пункта меню и индикатора фокуса'
            },
            onChange: function () {
                applyGlassStyles();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'blur',
                type: 'select',
                values: {
                    '8': 'Легкое размытие (8px — быстрее на слабых ТВ)',
                    '14': 'Среднее размытие (14px)',
                    '18': 'Оптимальное стекло (18px)',
                    '24': 'Глубокое матовое стекло (24px)',
                    '32': 'Ультра-стекло (32px)'
                },
                default: DEFAULTS.blur
            },
            field: {
                name: 'Сила размытия фона (Blur)',
                description: 'Регулирует глубину эффекта матового стекла за панелью меню'
            },
            onChange: function () {
                applyGlassStyles();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'opacity',
                type: 'select',
                values: {
                    '15': 'Максимальная прозрачность (15%)',
                    '25': 'Высокая прозрачность (25%)',
                    '35': 'Сбалансированная прозрачность (35%)',
                    '50': 'Полупрозрачное темное стекло (50%)',
                    '70': 'Плотное тонированное стекло (70%)'
                },
                default: DEFAULTS.opacity
            },
            field: {
                name: 'Прозрачность панели',
                description: 'Уровень затемнения стеклянной подложки меню'
            },
            onChange: function () {
                applyGlassStyles();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'floating',
                type: 'trigger',
                default: DEFAULTS.floating
            },
            field: {
    