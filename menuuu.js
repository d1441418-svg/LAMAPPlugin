(function () {
    'use strict';

    if (window.lampa_glass_menu_plugin) return;
    window.lampa_glass_menu_plugin = true;

    var STORAGE_PREFIX = 'glass_menu_';

    var DEFAULTS = {
        enabled: true,
        blur: '20',
        opacity: '45',
        accent: 'cyan',
        floating: true,
        glass_head: true,
        glass_bottom: true,
        glass_modals: true,
        glass_cards: true,
        fix_tmdb_posters: true,
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

        var blurPx = parseInt(getSetting('blur'), 10) || 20;
        var opacityVal = (parseInt(getSetting('opacity'), 10) || 45) / 100;
        var accentKey = getSetting('accent') || 'cyan';
        var accent = ACCENTS[accentKey] || ACCENTS.cyan;
        var isFloating = getSetting('floating');
        var glassHead = getSetting('glass_head');
        var glassBottom = getSetting('glass_bottom');
        var glassModals = getSetting('glass_modals');
        var glassCards = getSetting('glass_cards');
        var compactIcons = getSetting('compact_icons');

        var modalOpacity = Math.min(opacityVal + 0.25, 0.90).toFixed(2);
        var panelBg = 'rgba(12, 16, 26, ' + opacityVal.toFixed(2) + ')';

        var css = [
            ':root {',
            '    --gm-blur: ' + blurPx + 'px;',
            '    --gm-bg: ' + panelBg + ';',
            '    --gm-accent-rgb: ' + accent.primary + ';',
            '    --gm-accent-sec-rgb: ' + accent.secondary + ';',
            '    --gm-accent-hex: ' + accent.hex + ';',
            '    --gm-border: rgba(255, 255, 255, 0.14);',
            '    --gm-border-Active: rgba(' + accent.primary + ', 0.65);',
            '}',

            /* Боковое меню — БЕЗ изменения margin-left и transform у .wrap__left, чтобы не ломать закрытие */
            '.wrap__left {',
            '    background: var(--gm-bg) !important;',
            '    backdrop-filter: blur(var(--gm-blur)) saturate(190%) !important;',
            '    -webkit-backdrop-filter: blur(var(--gm-blur)) saturate(190%) !important;',
            '    border-right: 1px solid rgba(var(--gm-accent-rgb), 0.28) !important;',
            '    box-shadow: 10px 0 36px rgba(0, 0, 0, 0.65), inset -1px 0 12px rgba(var(--gm-accent-rgb), 0.08) !important;',
            isFloating ? '    border-radius: 0 1.45em 1.45em 0 !important;' : '',
            '}',

            /* Отступ снизу внутри скролла меню, чтобы нижний бар на телефоне не перекрывал "Shots" и "Спорт" */
            '.wrap__left .scroll__body, .wrap__left .menu {',
            '    padding-bottom: 5.5em !important;',
            '}',

            '.menu__list {',
            '    padding: 0.45em 0.65em !important;',
            '}',

            '.menu__split {',
            '    height: 1px !important;',
            '    margin: 0.7em 0.9em !important;',
            '    background: linear-gradient(90deg, transparent, rgba(var(--gm-accent-rgb), 0.4), transparent) !important;',
            '    border: none !important;',
            '}',

            /* Пункты бокового меню (красивы даже без курсора пульта на телефоне) */
            '.menu__item {',
            '    position: relative !important;',
            '    margin: 0.34em 0 !important;',
            '    padding: ' + (compactIcons ? '0.58em 0.9em' : '0.72em 1.05em') + ' !important;',
            '    border-radius: 0.95em !important;',
            '    background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%) !important;',
            '    border: 1px solid rgba(255, 255, 255, 0.09) !important;',
            '    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;',
            '    color: rgba(255, 255, 255, 0.88) !important;',
            '    transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1), background 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease !important;',
            '    overflow: hidden !important;',
            '}',

            /* Неоновый индикатор слева */
            '.menu__item::after {',
            '    content: "" !important;',
            '    position: absolute !important;',
            '    left: 0.22em !important;',
            '    top: 50% !important;',
            '    transform: translateY(-50%) scaleY(0.35) !important;',
            '    opacity: 0.45 !important;',
            '    width: 0.24em !important;',
            '    height: 45% !important;',
            '    border-radius: 1em !important;',
            '    background: linear-gradient(180deg, rgb(var(--gm-accent-rgb)), rgb(var(--gm-accent-sec-rgb))) !important;',
            '    box-shadow: 0 0 8px rgba(var(--gm-accent-rgb), 0.7) !important;',
            '    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease, height 0.25s ease !important;',
            '}',

            /* Иконки в меню сразу с легким неоновым свечением */
            '.menu__ico {',
            '    margin-right: 0.9em !important;',
            '    display: flex !important;',
            '    align-items: center !important;',
            '    justify-content: center !important;',
            '    filter: drop-shadow(0 0 5px rgba(var(--gm-accent-rgb), 0.35)) !important;',
            '    transition: transform 0.25s ease, filter 0.25s ease !important;',
            '}',

            '.menu__ico svg, .menu__ico img {',
            '    width: 1.3em !important;',
            '    height: 1.3em !important;',
            '    opacity: 0.92 !important;',
            '}',

            '.menu__text {',
            '    font-weight: 500 !important;',
            '    letter-spacing: 0.015em !important;',
            '}',

            /* Фокус, наведение, активный пункт или нажатие пальцем (:active) */
            '.menu__item.focus, .menu__item.traverse, .menu__item.hover, .menu__item:hover, .menu__item:active, .menu__item.active {',
            '    background: linear-gradient(135deg, rgba(var(--gm-accent-rgb), 0.28) 0%, rgba(var(--gm-accent-sec-rgb), 0.10) 100%) !important;',
            '    border-color: var(--gm-border-Active) !important;',
            '    color: #ffffff !important;',
            '    transform: translateX(0.25em) scale(1.015) !important;',
            '    box-shadow: 0 8px 22px -4px rgba(0, 0, 0, 0.55), 0 0 18px -2px rgba(var(--gm-accent-rgb), 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3) !important;',
            '}',

            '.menu__item.focus::after, .menu__item.traverse::after, .menu__item.hover::after, .menu__item:hover::after, .menu__item:active::after, .menu__item.active::after {',
            '    transform: translateY(-50%) scaleY(1) !important;',
            '    height: 60% !important;',
            '    opacity: 1 !important;',
            '}',

            '.menu__item.focus .menu__ico, .menu__item:active .menu__ico, .menu__item.active .menu__ico {',
            '    transform: scale(1.14) !important;',
            '    filter: drop-shadow(0 0 10px rgba(var(--gm-accent-rgb), 0.95)) !important;',
            '}',

            /* Верхняя шапка (Head) */
            glassHead ? [
                '.head__body {',
                '    background: rgba(12, 16, 26, ' + Math.max(opacityVal - 0.05, 0.25).toFixed(2) + ') !important;',
                '    backdrop-filter: blur(' + Math.round(blurPx * 0.85) + 'px) saturate(180%) !important;',
                '    -webkit-backdrop-filter: blur(' + Math.round(blurPx * 0.85) + 'px) saturate(180%) !important;',
                '    border-radius: 1.15em !important;',
                '    border: 1px solid rgba(var(--gm-accent-rgb), 0.22) !important;',
                '    padding: 0.35em 0.85em !important;',
                '    margin: 0.35em 0.5em !important;',
                '    box-shadow: 0 8px 26px rgba(0, 0, 0, 0.45), 0 0 15px rgba(var(--gm-accent-rgb), 0.1) !important;',
                '}',
                '.head__body {',
                '    background: rgba(12, 16, 26, ' + Math.max(opacityVal - 0.05, 0.25).toFixed(2) + ') !important;',
                '    backdrop-filter: blur(' + Math.round(blurPx * 0.85) + 'px) saturate(180%) !important;',
                '    -webkit-backdrop-filter: blur(' + Math.round(blurPx * 0.85) + 'px) saturate(180%) !important;',
                '    border-radius: 1.15em !important;',
                '    border: 1px solid rgba(var(--gm-accent-rgb), 0.22) !important;',
                '    padding: 0.35em 0.85em !important;',
                '    margin: 0.35em 0.5em !important;',
                '    box-shadow: 0 8px 26px rgba(0, 0, 0, 0.45), 0 0 15px rgba(var(--gm-accent-rgb), 0.1) !important;',
                '}',
                '.head__action {',
                '    border-radius: 0.75em !important;',
                '    background: rgba(255, 255, 255, 0.06) !important;',
                '    border: 1px solid rgba(255, 255, 255, 0.08) !important;',
                '    transition: all 0.22s ease !important;',
                '}',
                '.head__action.focus, .head__action.hover, .head__action:hover, .head__action:active {',
                '    background: linear-gradient(135deg, rgba(var(--gm-accent-rgb), 0.32), rgba(var(--gm-accent-sec-rgb), 0.14)) !important;',
                '    border-color: var(--gm-border-Active) !important;',
                '    box-shadow: 0 0 14px rgba(var(--gm-accent-rgb), 0.45) !important;',
                '    transform: scale(1.06) !important;',
                '}'
            ].join('\n') : '',

            /* Нижняя панель навигации на телефонах (Назад / Головна / Пошук / Налаштування) */
            glassBottom ? [
                '.navigation-bar__body {',
                '    background: rgba(12, 16, 26, ' + Math.min(opacityVal + 0.2, 0.85).toFixed(2) + ') !important;',
                '    backdrop-filter: blur(' + blurPx + 'px) saturate(190%) !important;',
                '    -webkit-backdrop-filter: blur(' + blurPx + 'px) saturate(190%) !important;',
                '    border-top: 1px solid rgba(var(--gm-accent-rgb), 0.28) !important;',
                '    border-radius: 1.25em 1.25em 0 0 !important;',
                '    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.65), 0 -2px 14px rgba(var(--gm-accent-rgb), 0.12) !important;',
                '}',
                '.navigation-bar__item {',
                '    border-radius: 0.85em !important;',
                '    margin: 0.25em !important;',
                '    transition: all 0.22s ease !important;',
                '}',
                '.navigation-bar__item.active, .navigation-bar__item:active, .navigation-bar__item.focus {',
                '    background: radial-gradient(circle at 50% 30%, rgba(var(--gm-accent-rgb), 0.25), transparent 75%) !important;',
                '    color: var(--gm-accent-hex) !important;',
                '}',
                '.navigation-bar__item.active svg, .navigation-bar__item:active svg {',
                '    filter: drop-shadow(0 0 8px rgba(var(--gm-accent-rgb), 0.9)) !important;',
                '    stroke: var(--gm-accent-hex) !important;',
                '}'
            ].join('\n') : '',

            /* Окно Настроек и модальные окна */
            glassModals ? [
                '.settings__content, .selectbox__content, .modal__content {',
                '    background: rgba(12, 16, 26, ' + modalOpacity + ') !important;',
                '    backdrop-filter: blur(' + (blurPx + 6) + 'px) saturate(190%) !important;',
                '    -webkit-backdrop-filter: blur(' + (blurPx + 6) + 'px) saturate(190%) !important;',
                '    border: 1px solid rgba(var(--gm-accent-rgb), 0.28) !important;',
                '    border-radius: 1.35em 1.35em 0 0 !important;',
                '    box-shadow: 0 -12px 48px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.16) !important;',
                '}',
                '.modal__content {',
                '    border-radius: 1.35em !important;',
                '}',
                '.settings-folder, .settings-param, .selectbox-item {',
                '    margin: 0.3em 0.5em !important;',
                '    border-radius: 0.85em !important;',
                '    background: rgba(255, 255, 255, 0.04) !important;',
                '    border: 1px solid rgba(255, 255, 255, 0.06) !important;',
                '    transition: all 0.2s ease !important;',
                '}',
                '.settings-folder__icon svg, .settings-folder__icon img {',
                '    filter: drop-shadow(0 0 6px rgba(var(--gm-accent-rgb), 0.45)) !important;',
                '}',
                '.settings-param.focus, .selectbox-item.focus, .settings-folder.focus, .settings-param:active, .selectbox-item:active, .settings-folder:active {',
                '    background: linear-gradient(90deg, rgba(var(--gm-accent-rgb), 0.26), rgba(var(--gm-accent-sec-rgb), 0.08)) !important;',
                '    border-color: var(--gm-border-Active) !important;',
                '    box-shadow: 0 4px 16px rgba(var(--gm-accent-rgb), 0.25) !important;',
                '    color: #fff !important;',
                '}'
            ].join('\n') : '',

            /* Стеклянные карточки фильмов и неоновые оценки */
            glassCards ? [
                '.card__view {',
                '    border-radius: 0.95em !important;',
                '    border: 1px solid rgba(255, 255, 255, 0.1) !important;',
                '    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45) !important;',
                '    overflow: hidden !important;',
                '    transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease !important;',
                '}',
                '.card.focus .card__view, .card.hover .card__view, .card:active .card__view {',
                '    border-color: var(--gm-accent-hex) !important;',
                '    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.7), 0 0 20px rgba(var(--gm-accent-rgb), 0.55) !important;',
                '    transform: scale(1.03) !important;',
                '}',
                '.card__vote {',
                '    background: rgba(10, 14, 24, 0.72) !important;',
                '    backdrop-filter: blur(8px) !important;',
                '    -webkit-backdrop-filter: blur(8px) !important;',
                '    border: 1px solid rgba(var(--gm-accent-rgb), 0.45) !important;',
                '    border-radius: 0.55em !important;',
                '    color: #fff !important;',
                '    font-weight: 700 !important;',
                '    box-shadow: 0 0 10px rgba(var(--gm-accent-rgb), 0.3) !important;',
                '}',
                '.card__type {',
                '    background: linear-gradient(135deg, rgb(var(--gm-accent-rgb)), rgb(var(--gm-accent-sec-rgb))) !important;',
                '    color: #000 !important;',
                '    font-weight: 700 !important;',
                '    border-radius: 0.45em !important;',
                '    box-shadow: 0 0 12px rgba(var(--gm-accent-rgb), 0.6) !important;',
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

    /* Авто-исправление сломанных постеров image.tmdb.org через быстрый прокси wsrv.nl */
    function initTmdbPosterFixer() {
        window.addEventListener('error', function (e) {
            if (!getSetting('fix_tmdb_posters')) return;
            var target = e.target;
            if (target && target.tagName === 'IMG' && target.src && target.src.indexOf('image.tmdb.org') !== -1) {
                if (!target.getAttribute('data-gm-proxied')) {
                    target.setAttribute('data-gm-proxied', '1');
                    target.src = 'https://wsrv.nl/?url=' + encodeURIComponent(target.src);
                }
            }
        }, true);
    }

    function applyMenuVisibility() {
        var hiddenActions = getSetting('hide_items') || [];
        if (!Array.isArray(hiddenActions)) hiddenActions = [];

        $('.menu__item').each(function () {
            var item = $(this);
            var action = item.attr('data-action') || '';
            var text = item.find('.menu__text').text().trim();

            if ((action && hiddenActions.indexOf(action) !== -1) || (text && hiddenActions.indexOf(text) !== -1)) {
                item.addClass('hide').css('display', 'none');
            } else {
                item.removeClass('hide').css('display', '');
            }
        });
    }

    function openHideItemsDialog() {
        var items = [];
        var hiddenActions = getSetting('hide_items') || [];
        if (!Array.isArray(hiddenActions)) hiddenActions = [];

        var added = {};
        $('.menu__item').each(function () {
            var el = $(this);
            var text = el.find('.menu__text').text().trim();
            var action = el.attr('data-action') || text;
            if (!text || added[action]) return;
            added[action] = true;

            var isHidden = hiddenActions.indexOf(action) !== -1;
            items.push({
                title: text,
                value: action,
                checkbox: true,
                checked: isHidden
            });
        });

        if (!items.length) {
            Lampa.Noty.show('Сначала откройте боковое меню');
            return;
        }

        Lampa.Select.show({
            title: 'Скрыть пункты меню',
            items: items,
            onBack: function () {
                Lampa.Controller.toggle('settings');
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
                name: 'Включить Glass UI',
                description: 'Активирует матовое стекло, неоновую подсветку и анимации'
            },
            onChange: applyGlassStyles
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
                name: 'Цветовой акцент неона',
                description: 'Цвет свечения меню, шапки, нижнего бара и рамок карточек'
            },
            onChange: applyGlassStyles
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'blur',
                type: 'select',
                values: {
                    '10': 'Легкое размытие (10px)',
                    '16': 'Среднее размытие (16px)',
                    '20': 'Оптимальное стекло (20px)',
                    '28': 'Глубокое стекло (28px)'
                },
                default: DEFAULTS.blur
            },
            field: {
                name: 'Сила размытия (Blur)',
                description: 'Глубина матового стекла за панелями'
            },
            onChange: applyGlassStyles
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'opacity',
                type: 'select',
                values: {
                    '25': 'Прозрачное стекло (25%)',
                    '35': 'Сбалансированное (35%)',
                    '45': 'Насыщенное темное стекло (45%)',
                    '65': 'Плотное темное стекло (65%)'
                },
                default: DEFAULTS.opacity
            },
            field: {
                name: 'Плотность затемнения',
                description: 'Уровень непрозрачности стеклянных панелей'
            },
            onChange: applyGlassStyles
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'glass_cards',
                type: 'trigger',
                default: DEFAULTS.glass_cards
            },
            field: {
                name: 'Стеклянные карточки и оценки',
                description: 'Неоновая рамка карточек фильмов и стеклянный рейтинг'
            },
            onChange: applyGlassStyles
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'fix_tmdb_posters',
                type: 'trigger',
                default: DEFAULTS.fix_tmdb_posters
            },
            field: {
                name: 'Авто-фикс постеров TMDB',
                description: 'Загружает сломанные постеры image.tmdb.org через рабочий прокси'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'glass_bottom',
                type: 'trigger',
                default: DEFAULTS.glass_bottom
            },
            field: {
                name: 'Стеклянный нижний бар',
                description: 'Оформляет нижнюю панель навигации на смартфоне'
            },
            onChange: applyGlassStyles
        });

        Lampa.SettingsApi.addParam({
            component: 'glass_menu',
            param: {
                name: STORAGE_PREFIX + 'hide_items_btn',
                type: 'button'
            },
            field: {
                name: 'Скрыть лишние пункты меню',
                description: 'Выбрать пункты бокового меню, которые не нужны'
            },
            onChange: openHideItemsDialog
        });
    }

    function initPlugin() {
        applyGlassStyles();
        applyMenuVisibility();
        registerSettings();
        initTmdbPosterFixer();

        Lampa.Listener.follow('menu', function () {
            applyMenuVisibility();
        });

        Lampa.Listener.follow('activity', function (e) {
            if (e.type === 'start') {
                applyMenuVisibility();
            }
        });
    }

    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initPlugin();
        });
    }
})();