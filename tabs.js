(function () {
    'use strict';

    function startTabsPlugin() {
        if (document.getElementById('lampa-custom-tabs-css')) return;

        var css = `
            .vip-tabs-wrap {
                padding: 5px;
            }
            .vip-tabs-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 16px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .vip-tabs-filter-btn {
                padding: 8px 16px;
                border-radius: 20px;
                background: rgba(255, 255, 255, 0.08);
                color: #cccccc;
                font-size: 0.9em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.08);
            }
            .vip-tabs-filter-btn.active {
                background: #ffb703;
                color: #000000;
                border-color: #ffb703;
            }
            .vip-tabs-filter-btn.focus {
                transform: scale(1.06);
                border-color: #ffffff;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            }
            .vip-tabs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
                gap: 12px;
            }
            .vip-tab-card {
                position: relative;
                border-radius: 14px;
                padding: 16px;
                min-height: 85px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
                transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
                cursor: pointer;
            }
            .vip-tab-card__title {
                font-size: 1.08em;
                font-weight: 800;
                color: #ffffff;
                z-index: 2;
            }
            .vip-tab-card__sub {
                font-size: 0.78em;
                color: rgba(255, 255, 255, 0.78);
                margin-top: 6px;
                z-index: 2;
            }
            .vip-tab-card.focus {
                transform: scale(1.05) translateY(-3px);
                border-color: #ffffff;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.75), 0 0 15px rgba(255, 255, 255, 0.2);
            }
        `;

        var style = document.createElement('style');
        style.id = 'lampa-custom-tabs-css';
        style.innerHTML = css;
        document.head.appendChild(style);

        var categories = [
            // === 2026 РІК ===
            {
                group: '2026',
                title: 'Новинки 2026',
                sub: 'Головні прем’єри року',
                url: 'discover/movie?primary_release_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ff6b00, #ff0055)'
            },
            {
                group: '2026',
                title: 'Комедії 2026',
                sub: 'Свіжі фільми для настрою',
                url: 'discover/movie?with_genres=35&primary_release_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #00b09b, #96c93d)'
            },
            {
                group: '2026',
                title: 'Жахи 2026',
                sub: 'Нові хорори та містика',
                url: 'discover/movie?with_genres=27&primary_release_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #790909, #1f0505)'
            },
            {
                group: '2026',
                title: 'Екшен 2026',
                sub: 'Нові бойовики та блокбастери',
                url: 'discover/movie?with_genres=28&primary_release_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #f12711, #f5af19)'
            },
            {
                group: '2026',
                title: 'Серіали 2026',
                sub: 'Нові сезони та телепрем’єри',
                url: 'discover/tv?first_air_date_year=2026&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #11998e, #38ef7d)'
            },

            // === ЖАНРИ ===
            {
                group: 'genres',
                title: 'Топ Комедії',
                sub: 'Найсмішніші фільми всіх часів',
                url: 'discover/movie?with_genres=35&vote_count.gte=500&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #f7971e, #ffd200)'
            },
            {
                group: 'genres',
                title: 'Молодіжні Комедії',
                sub: 'Приколи, вечірки та відрив',
                url: 'discover/movie?with_genres=35&with_keywords=9713|6075&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ff416c, #ff4b2b)'
            },
            {
                group: 'genres',
                title: 'Жахи та Скрімери',
                sub: 'Найстрашніші фільми',
                url: 'discover/movie?with_genres=27&vote_count.gte=300&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #232526, #414345)'
            },
            {
                group: 'genres',
                title: 'Крутий Екшен',
                sub: 'Вибухи, бійки та перестрілки',
                url: 'discover/movie?with_genres=28&vote_count.gte=500&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #cb2d3e, #ef473a)'
            },
            {
                group: 'genres',
                title: 'Фантастика і Космос',
                sub: 'Майбутнє, технології та світи',
                url: 'discover/movie?with_genres=878&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #00c6ff, #0072ff)'
            },
            {
                group: 'genres',
                title: 'Фентезі та Магія',
                sub: 'Монстри, мечі та чарівні світи',
                url: 'discover/movie?with_genres=14&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #6a3093, #a044ff)'
            },
            {
                group: 'genres',
                title: 'Кримінал і Мафія',
                sub: 'Банди, пограбування та розбірки',
                url: 'discover/movie?with_genres=80&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #141e30, #243b55)'
            },
            {
                group: 'genres',
                title: 'Гострі Трилери',
                sub: 'Напруга до останньої хвилини',
                url: 'discover/movie?with_genres=53&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
            },
            {
                group: 'genres',
                title: 'Детективи і Таємниці',
                sub: 'Заплутані розслідування',
                url: 'discover/movie?with_genres=9648&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #3a6186, #89253e)'
            },
            {
                group: 'genres',
                title: 'Пригоди',
                sub: 'Подорожі, скарби та джунглі',
                url: 'discover/movie?with_genres=12&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #134e5e, #71b280)'
            },
            {
                group: 'genres',
                title: 'Романтика і Любов',
                sub: 'Історії про почуття та стосунки',
                url: 'discover/movie?with_genres=10749&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ff758c, #ff7eb3)'
            },

            // === СПЕЦІАЛЬНА ТЕМАТИКА ===
            {
                group: 'themes',
                title: 'Супергерої (Marvel / DC)',
                sub: 'Комікси та суперсили',
                url: 'discover/movie?with_keywords=9715&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #e52d27, #b31217)'
            },
            {
                group: 'themes',
                title: 'Зомбі та Апокаліпсис',
                sub: 'Віруси, мутанти та кінець світу',
                url: 'discover/movie?with_keywords=12377|4458&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #3c1053, #ad5389)'
            },
            {
                group: 'themes',
                title: 'Виживання',
                sub: 'Дика природа, острови та пастки',
                url: 'discover/movie?with_keywords=10349&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #1e3c72, #2a5298)'
            },
            {
                group: 'themes',
                title: 'Тачки та Перегони',
                sub: 'Швидкість, дрифт і погоні',
                url: 'discover/movie?with_keywords=830|6400&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ff8008, #ffc837)'
            },

            // === АНІМЕ ТА МУЛЬТФІЛЬМИ ===
            {
                group: 'anime',
                title: 'Аніме Серіали (Хіти)',
                sub: 'Найпопулярніші японські тайтли',
                url: 'discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ec008c, #fc6767)'
            },
            {
                group: 'anime',
                title: 'Аніме Фільми',
                sub: 'Повнометражні хіти Японії',
                url: 'discover/movie?with_genres=16&with_original_language=ja&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #8e2de2, #4a00e0)'
            },
            {
                group: 'anime',
                title: 'Аніме 16+ / Еччі',
                sub: 'Гаремники, романтика та фансервіс',
                url: 'discover/tv?with_genres=16,10749&with_original_language=ja&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #ff0844, #ffb199)'
            },
            {
                group: 'anime',
                title: 'Мультфільми',
                sub: 'Найкраща анімація (Pixar, DreamWorks)',
                url: 'discover/movie?with_genres=16&without_original_language=ja&sort_by=popularity.desc',
                bg: 'linear-gradient(135deg, #
