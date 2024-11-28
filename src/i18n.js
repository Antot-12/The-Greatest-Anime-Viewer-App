// // import i18n from "i18next";
// // import { initReactI18next } from "react-i18next";
// // import HttpApi from "i18next-http-backend";
// // import LanguageDetector from "i18next-browser-languagedetector";
// //
// // i18n
// //   .use(HttpApi)
// //   .use(LanguageDetector)
// //   .use(initReactI18next)
// //   .init({
// //     supportedLngs: ["en", "uk"], // Мови
// //     fallbackLng: "en", // Мова за замовчуванням
// //     detection: {
// //       order: ["cookie", "localStorage", "navigator"],
// //       caches: ["cookie", "localStorage"],
// //     },
// //     backend: {
// //       loadPath: "/locales/{{lng}}/translation.json",
// //     },
// //     react: {
// //       useSuspense: false,
// //     },
// //   });
// //
// // export default i18n;
//
// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
//
// i18n.use(initReactI18next).init({
//   lng: "en", // Мова за замовчуванням
//   fallbackLng: "en",
//   interpolation: {
//     escapeValue: false, // React вже обробляє екранування
//   },
//   resources: {
//     en: {
//       translation: {
//         anime_list: "Anime List",
//         search: "Search...",
//         favorites: "Favorites",
//         watched: "Watched",
//         to_watch: "To Watch",
//         trash: "Trash",
//         rows_per_page: "Rows per page",
//         leave_comment: "Leave your comment",
//         rating: "Rating",
//         year: "Year",
//         episodes: "Episodes",
//       },
//     },
//     uk: {
//       translation: {
//         anime_list: "Список аніме",
//         search: "Пошук...",
//         favorites: "Улюблені",
//         watched: "Переглянуті",
//         to_watch: "Для перегляду",
//         trash: "Кошик",
//         rows_per_page: "Кількість рядків",
//         leave_comment: "Залиште ваш коментар",
//         rating: "Оцінка",
//         year: "Рік",
//         episodes: "Епізоди",
//       },
//     },
//   },
// });
//
// export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        anime_list: "Anime List",
        search_placeholder: "Search anime...",
      },
    },
    uk: {
      translation: {
        anime_list: "Список Аніме",
        search_placeholder: "Шукати аніме...",
      },
    },
  },
  lng: "uk",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
