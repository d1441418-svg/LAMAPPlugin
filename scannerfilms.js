(function () {
    'use strict';

    // Словник перекладів
    var translations = {
        ua: {
            title: 'Аналіз контенту',
            action: 'Екшен',
            drama: 'Драма',
            comedy: 'Комедія',
            horror: 'Жахи',
            romance: 'Романтика',
            crime: 'Кримінал',
            source: 'TMDB Local',
            settings_name: 'Мова сканера',
            settings_desc: 'Оберіть мову для блоку аналізу фільму'
        },
        ru: {
            title: 'Анализ контента',
            action: 'Экшен',
            drama: 'Драма',
            comedy: 'Комедия',
            horror: 'Ужасы',
            romance: 'Романтика',
            crime: 'Криминал',
            source: 'TMDB Local',
            settings_name: 'Язык сканера',
            settings_desc: 'Выберите язык для блока анализа фильма'
        },
        en: {
            title: 'Content Analysis',
            action: 'Action',
            drama: 'Drama',
            comedy: 'Comedy',
            horror: 'Horror',
            romance: 'Romance',
            crime: 'Crime',
            source: 'TMDB Local',
            settings_name: 'Scanner Language',
            settings_desc: 'Select language for movie analysis block'
        }
    };

    function getLang() {
        var saved = Lampa.Storage.get('lampa_scanner_lang');
        if (saved && translations[saved]) return saved;
        
        // Автовизначення мови Lampa
        var lampaLang = Lampa.Storage.get('language') || 'ru';
        if (lampaLang === 'uk' || lampaLang === 'ua') return 'ua';
        if (lampaLang === 'en') return 'en';
        return 'ru'; // за замовчуванням російська, якщо інша
    }

    function initScanner() {
        if (document.getElementById('lampa-scanner-style')) return;

        var css = `
            .lampa-scanner {
                background: rgba(25, 25, 30, 0.85);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                padding: 14px 16px;
                margin: 14px 0;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                max-width: 700px;
            }
            .lampa-scanner__head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                font-size: 0.9em;
                font-weight: 700;
                color: #fff;
            }
            .lampa-scanner__grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 10px 16px;
            }
            .lampa-scanner__item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .lampa-scanner__info {
                display: flex;
                justify-content: space-between;
                font-size: 0.82em;
                color: #cccccc;
            }
            .lampa-scanner__score {
                font-weight: 600;
                color: #ffffff;
            }
            .lampa-scanner__track {
                height: 5px;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 4px;
                overflow: hidden;
            }
            .lampa-scanner__fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.4s ease;
            }
        `;

        var style = document.createElement('style');
        style.id = 'lampa-scanner-style';
        style.innerHTML = css;
        document.head.appendChild(style);

        // Додаємо налаштування мови в меню Lampa
        if (window.Lampa && Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: 'lampa_scanner_lang',
                type: 'select',
                values: {
                    ua: 'Українська',
                    ru: 'Русский',
                    en: 'English'
                },
                default: 'ru',
                name: 'Мова сканера фільмів',
                desc: 'Виберіть мову для блоку аналізу контенту'
            });
        }

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                var movie = e.data.movie;
                if (!movie) return;

                var render = e.object.activity.render();
                if (render.find('.lampa-scanner').length) return;

                var langKey = getLang();
                var t = translations[langKey] || translations.ru;

                // Розрахунок балів
                var genres = (movie.genres || []).map(function (g) { return g.id; });
                var overview = ((movie.overview || '') + ' ' + (movie.title || '')).toLowerCase();

                var action = (genres.indexOf(28) !== -1 || genres.indexOf(12) !== -1) ? 8 : 3;
                var drama = genres.indexOf(18) !== -1 ? 8 : 4;
                var comedy = genres.indexOf(35) !== -1 ? 8 : 2;
                var horror = (genres.indexOf(27) !== -1 || genres.indexOf(53) !== -1) ? 8 : 1;
                var romance = genres.indexOf(10749) !== -1 ? 8 : 2;
                var crime = (genres.indexOf(80) !== -1 || genres.indexOf(9648) !== -1) ? 8 : 2;

                if (/екшн|вибух|бой|action|explosion|взрыв/.test(overview)) action = Math.min(10, action + 2);
                if (/сум|драм|трагеді|drama|трагедия/.test(overview)) drama = Math.min(10, drama + 2);
                if (/сміх|комеді|жарт|funny|comedy|комедия|шутка/.test(overview)) comedy = Math.min(10, comedy + 2);
                if (/жах|кров|страх|horror|killer|ужас|кровь/.test(overview)) horror = Math.min(10, horror + 2);

                var box = $(
                    '<div class="lampa-scanner">' +
                        '<div class="lampa-scanner__head">' +
                            '<span>' + t.title + '</span>' +
                            '<span style="font-size: 0.8em; color: #888;">' + t.source + '</span>' +
                        '</div>' +
                        '<div class="lampa-scanner__grid">' +
                            createBar(t.action, action, '#e50914') +
                            createBar(t.drama, drama, '#3b82f6') +
                            createBar(t.comedy, comedy, '#10b981') +
                            createBar(t.horror, horror, '#8b5cf6') +
                            createBar(t.romance, romance, '#ec4899') +
                            createBar(t.crime, crime, '#f59e0b') +
                        '</div>' +
                    '</div>'
                );

                var target = render.find('.full-descr');
                if (target.length) {
                    target.before(box);
                } else {
                    render.find('.full-start-new__buttons, .full-start__buttons').after(box);
                }
            }
        });
    }

    function createBar(label, val, color) {
        var num = Math.max(1, Math.min(10, val));
        var width = num * 10;
        return (
            '<div class="lampa-scanner__item">' +
                '<div class="lampa-scanner__info">' +
                    '<span>' + label + '</span>' +
                    '<span class="lampa-scanner__score">' + num + '/10</span>' +
                '</div>' +
                '<div class="lampa-scanner__track">' +
                    '<div class="lampa-scanner__fill" style="width: ' + width + '%; background: ' + color + ';"></div>' +
                '</div>' +
            '</div>'
        );
    }

    if (window.appready) {
        initScanner();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initScanner();
        });
    }
})();
