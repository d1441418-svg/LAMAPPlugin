(function () {
    'use strict';

    function applySoftVipUI() {
        var oldStyle = document.getElementById('lampa-vip-ui-style');
        if (oldStyle) oldStyle.remove();

        var css = `
            /* === АТМОСФЕРНИЙ ТЕПЛИЙ ФОН ДЛЯ ОЧЕЙ === */
            body::before {
                content: "";
                position: fixed;
                top: -20%;
                left: -10%;
                width: 60%;
                height: 60%;
                background: radial-gradient(circle, rgba(255, 140, 0, 0.07) 0%, transparent 70%);
                pointer-events: none;
                z-index: 0;
                filter: blur(80px);
            }
            body::after {
                content: "";
                position: fixed;
                bottom: -20%;
                right: -10%;
                width: 60%;
                height: 60%;
                background: radial-gradient(circle, rgba(0, 150, 255, 0.05) 0%, transparent 70%);
                pointer-events: none;
                z-index: 0;
                filter: blur(80px);
            }

            /* === 1. НИЖНЯ ПАНЕЛЬ (SOFT DOCK) === */
            .navigation-bar {
                background: rgba(18, 20, 26, 0.75) !important;
                backdrop-filter: blur(20px) saturate(160%) !important;
                -webkit-backdrop-filter: blur(20px) saturate(160%) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 24px !important;
                margin: 0 auto 12px auto !important;
                width: 90% !important;
                max-width: 500px !important;
                left: 0 !important;
                right: 0 !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7) !important;
                padding: 4px 8px !important;
            }
            .navigation-bar__body {
                background: transparent !important;
                border: none !important;
            }
            .navigation-bar__item {
                border-radius: 16px !important;
                transition: all 0.25s ease !important;
            }
            .navigation-bar__item.active,
            .navigation-bar__item.focus {
                background: rgba(255, 255, 255, 0.1) !important;
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5) !important;
            }

            /* === 2. М'ЯКІ КАРТКИ ТА ПОСТЕРИ === */
            .card__view {
                border-radius: 16px !important;
                overflow: hidden !important;
                transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease !important;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
                border: 1px solid rgba(255, 255, 255, 0.04) !important;
            }
            .card__img {
                border-radius: 16px !important;
            }
            .card.focus .card__view,
            .card.hover .card__view {
                transform: scale(1.06) translateY(-4px) !important;
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.15) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }
            .card.focus .card__view::after {
                display: none !important;
            }

            /* Спокійний рейтинг (не "випалює" очі) */
            .card__vote {
                background: rgba(30, 30, 35, 0.85) !important;
                backdrop-filter: blur(10px) !important;
                color: #ffb703 !important;
                font-weight: 700 !important;
                border-radius: 8px !important;
                border: 1px solid rgba(255, 183, 3, 0.3) !important;
                padding: 0.2em 0.5em !important;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4) !important;
            }
            .card__quality {
                background: rgba(30, 30, 35, 0.85) !important;
                backdrop-filter: blur(10px) !important;
                color: #00b4d8 !important;
                font-weight: 700 !important;
                border-radius: 8px !important;
                border: 1px solid rgba(0, 180, 216, 0.3) !important;
            }

            /* === 3. ПОШУК ТА КЛАВІАТУРА === */
            .search,
            .search-box {
                background: rgba(15, 16, 20, 0.9) !important;
                backdrop-filter: blur(25px) !important;
            }
            .search__input,
            .search-box__input {
                background: rgba(255, 255, 255, 0.06) !important;
                border: 1px solid rgba(255, 255, 255, 0.12) !important;
                border-radius: 14px !important;
                transition: all 0.2s ease !important;
            }
            .search__input.focus,
            .search-box__input.focus {
                border-color: rgba(255, 183, 3, 0.6) !important;
                box-shadow: 0 0 15px rgba(255, 183, 3, 0.2) !important;
                background: rgba(255, 255, 255, 0.09) !important;
            }
            .hg-button {
                background: rgba(255, 255, 255, 0.06) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 10px !important;
                color: #e0e0e0 !important;
                transition: all 0.15s ease !important;
            }
            .hg-button.focus,
            .hg-button:active {
                background: rgba(255, 255, 255, 0.2) !important;
                color: #ffffff !important;
                transform: scale(1.1) !important;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5) !important;
                border-color: rgba(255, 255, 255, 0.4) !important;
            }

            /* === 4. КНОПКИ ТА МЕНЮ === */
            .full-start__button,
            .full-start-new__buttons .full-start__button {
                border-radius: 12px !important;
                background: rgba(255, 255, 255, 0.07) !important;
                backdrop-filter: blur(12px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                transition: all 0.2s ease !important;
            }
            .full-start__button.focus {
                background: rgba(255, 255, 255, 0.22) !important;
                color: #ffffff !important;
                border-color: rgba(255, 255, 255, 0.4) !important;
                transform: scale(1.05) !important;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5) !important;
            }
            .menu__item {
                border-radius: 10px !important;
                margin-bottom: 0.2em !important;
                transition: all 0.2s ease !important;
            }
            .menu__item.focus,
            .menu__item.hover {
                transform: translateX(6px) !important;
                background: rgba(255, 255, 255, 0.08) !important;
                border-left: 3px solid #ffb703 !important;
            }

            /* === 5. НАЛАШТУВАННЯ ТА МОДАЛЬНІ ВІКНА === */
            .settings__content,
            .selectbox__content,
            .modal__content {
                background: rgba(20, 21, 26, 0.88) !important;
                backdrop-filter: blur(25px) !important;
                border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            .modal__content {
                border-radius: 18px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
        `;

        var style = document.createElement('style');
        style.id = 'lampa-vip-ui-style';
        style.innerHTML = css;
        document.head.appendChild(style);

        Lampa.Storage.set('glass_style', true);
        Lampa.Storage.set('light_version', false);

        Lampa.Noty.show('✨ VIP Soft UI активовано');
    }

    if (window.appready) {
        applySoftVipUI();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') applySoftVipUI();
        });
    }
})();
