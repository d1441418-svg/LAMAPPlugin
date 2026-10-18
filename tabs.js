(function () {
    'use strict';

    function startTabsPlugin() {
        if (document.getElementById('lampa-custom-tabs-css')) return;

        // Стилі для крутих карток-вкладок
        var css = `
            .vip-tabs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 14px;
                padding: 10px 5px;
            }
            .vip-tab-card {
                position: relative;
                border-radius: 16px;
                padding: 20px 18px;
                min-height: 95px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
                transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease;
                cursor: pointer;
            }
            .vip-tab-card__title {
                font-size: 1.15em;
                font-weight: 800;
                color: #ffffff;
                z-index: 2;
                letter-spacing: 0.3px;
            }
            .vip-tab-card__sub {
                font-size: 0.82em;
                color: rgba(255, 255, 255, 0.75);
                margin-top: 6px;
                z-index: 2;
            }
            .vip-tab-card.focus {
                transform: scale(1.05) translateY(-3px);
                border-color: #ffffff;
                box-shadow: 0 12px 28px rgba(0, 0, 0, 0.7), 0 0 18px rgba(255, 255, 255, 0.2);
            }
        `;

        var style = document.createElement('style');
        style.id = 'lampa-custom-tabs-css';
        style.innerHTML = css;
        document.head.appendChild(style);

        // Список онлайн-вкладок (оновлюються автоматично з бази TMDB)
        var categories = [
            {
                title: 'Новинки 2026',
                sub: 'Головні прем’єри року',
                url: 'discover/movie?primary_release_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ff6b00, #ff0055)'
            },
            {
                title: 'Жахи 2026',
                sub: 'Нові хорори та містика',
                url: 'discover/movie?with_genres=27&primary_release_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #790909, #1f0505)'
            },
            {
                title: 'Топ Комедії',
                sub: 'Найкращі фільми для настрою',
                url: 'discover/movie?with_genres=35&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #00b09b, #96c93d)'
            },
            {
                title: 'Аніме Хіти',
                sub: 'Японська анімація та новинки',
                url: 'discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ec008c, #fc6767)'
            },
            {
                title: 'Аніме Фільми',
                sub: 'Повнометражні релізи',
                url: 'discover/movie?with_genres=16&with_original_language=ja&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #8e2de2, #4a00e0)'
            },
            {
                title: 'Крутий Екшен',
                sub: 'Бойовики та блокбастери 2026',
                url: 'discover/movie?with_genres=28&primary_release_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #f12711, #f5af19)'
            },
            {
                title: 'Жахи (Всі часи)',
                sub: 'Найпопулярніші страшилки',
                url: 'discover/movie?with_genres=27&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #434343, #000000)'
            },
            {
                title: 'Фантастика',
                sub: 'Космос, майбутнє та технології',
                url: 'discover/movie?with_genres=878&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #00c6ff, #0072ff)'
            },
            {
                title: 'Гострі Трилери',
                sub: 'Напружений сюжет і детективи',
                url: 'discover/movie?with_genres=53,9648&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #141e30, #243b55)'
            },
            {
                title: 'Топ Серіали 2026',
                sub: 'Нові сезони та прем’єри',
                url: 'discover/tv?first_air_date_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #11998e, #38ef7d)'
            }
        ];

        // Створюємо вікно з картками вкладок
        function openTabsModal() {
            var container = $('<div class="vip-tabs-grid"></div>');

            categories.forEach(function (cat) {
                var card = $(
                    '<div class="vip-tab-card selector" style="background: ' + cat.bg + ';">' +
                        '<div class="vip-tab-card__title">' + cat.title + '</div>' +
                        '<div class="vip-tab-card__sub">' + cat.sub + '</div>' +
                    '</div>'
                );

                card.on('hover:enter', function () {
                    Lampa.Modal.close();
                    Lampa.Activity.push({
                        url: cat.url,
                        title: cat.title,
                        component: 'category_full',
                        source: 'tmdb',
                        card_type: true,
                        page: 1
                    });
                });

                container.append(card);
            });

            Lampa.Modal.open({
                title: 'Вкладки та добірки',
                html: container,
                size: 'large',
                onBack: function () {
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('menu');
                }
            });
        }

        // Додаємо кнопку "Вкладки" у бічну панель (ліве меню)
        var menuButton = $(
            '<li class="menu__item selector" data-action="vip_tabs">' +
                '<div class="menu__ico">' +
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect>' +
                        '<rect x="14" y="3" width="7" height="7" rx="1.5"></rect>' +
                        '<rect x="14" y="14" width="7" height="7" rx="1.5"></rect>' +
                        '<rect x="3" y="14" width="7" height="7" rx="1.5"></rect>' +
                    '</svg>' +
                '</div>' +
                '<div class="menu__text">Вкладки</div>' +
            '</li>'
        );

        menuButton.on('hover:enter', function () {
            openTabsModal();
        });

        $('.menu .menu__list').eq(0).append(menuButton);
    }

    if (window.appready) {
        startTabsPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startTabsPlugin();
        });
    }
})();
