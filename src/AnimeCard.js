import React from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";

const AnimeCard = ({ anime, onUpdateCategory, onDeleteAnime, apiBaseUrl, category }) => {
  // Обрізаємо опис, якщо він дуже довгий
  const truncatedSummary =
    anime.summary && anime.summary.length > 350
      ? anime.summary.substring(0, 350) + "..."
      : anime.summary;

  // Список доступних категорій для аніме
  const availableCategories = ["favorites", "watched", "to_watch", "trash"];

  // Функція для видалення аніме з категорії
  const handleDelete = () => {
    onDeleteAnime(anime.title); // Викликаємо функцію для видалення
  };

  // Функція для переміщення аніме між категоріями
  const handleCategoryChange = (categoryOption) => {
    const currentCategories = anime.categories || [];
    if (!currentCategories.includes(categoryOption)) {
      onUpdateCategory(anime.title, [...currentCategories, categoryOption]); // Додаємо нову категорію
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#2b2b2b", // Колір фону картки
        padding: "15px", // Відступи
        borderRadius: "10px", // Кутові радіуси
        textAlign: "center", // Центруємо контент
        border: "2px solid #ffa500", // Оформлення бордером
        height: "100%", // Висота картки
        width: "360px", // Ширина картки
        margin: "20px 0", // Вертикальні відступи
        display: "flex",
        flexDirection: "column", // Вертикальне вирівнювання елементів
        justifyContent: "space-between", // Розподіл простору
      }}
    >
      {/* Покажемо рейтинг аніме з індикатором кольору */}
      <Tooltip title={`Rating: ${anime.rating}`} arrow>
        <Typography
          variant="h6"
          sx={{
            color: anime.rating >= 7 ? "#4caf50" : anime.rating >= 5 ? "#ff9800" : "#f44336",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Оцінка: {anime.rating || "N/A"}
        </Typography>
      </Tooltip>

      {/* Посилання на сайт аніме, зображення як мініатюра */}
      <a
        href={anime.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <img
          src={`${apiBaseUrl}/api/proxy_image?url=${encodeURIComponent(anime.image_url)}`}
          alt={anime.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px", // Округляємо кути
          }}
          onError={(e) => {
            // Якщо картинка не завантажилась, відобразити запасну картинку
            e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
          }}
        />
      </a>

      {/* Назва аніме */}
      <Typography
        variant="h5"
        sx={{
          color: "#00bcd4",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {anime.title}
      </Typography>

      {/* Інформація про рік та серії */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          color: "#ffa500",
          fontSize: "0.9rem",
          fontWeight: "bold",
        }}
      >
        <Typography variant="body2">{`Рік: ${anime.year}`}</Typography>
        <Typography variant="body2">{`Серії: ${anime.series_info || "N/A"}`}</Typography>
      </Box>

      {/* Опис аніме */}
      <Typography
        variant="body2"
        sx={{
          color: "#01a8af",
          textAlign: "justify",
          marginBottom: "15px",
        }}
      >
        {truncatedSummary || "Опис відсутній."}
      </Typography>

      {/* Кнопки для переміщення аніме між категоріями */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // Відображаємо дві колонки
          gap: "10px",
        }}
      >
        {/* Якщо ми на вкладці "all", показуємо всі можливі категорії */}
        {category === "all" ? (
          availableCategories.map((categoryOption) => (
            <Button
              key={categoryOption}
              sx={{
                border: "1px solid #ffa500",
                color: anime.categories?.includes(categoryOption) ? "#4caf50" : "#ffa500",
                backgroundColor: "transparent",
                padding: "5px 10px",
                fontSize: "0.9rem",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#ffa500",
                  color: "#1e1e1e",
                },
              }}
              onClick={() => handleCategoryChange(categoryOption)}
            >
              {categoryOption.charAt(0).toUpperCase() + categoryOption.slice(1)}
            </Button>
          ))
        ) : (
          // Якщо ми не на вкладці "all", показуємо тільки кнопки для переміщення
          availableCategories.filter((cat) => cat !== category).map((categoryOption) => (
            <Button
              key={categoryOption}
              sx={{
                border: "1px solid #ffa500",
                color: anime.categories?.includes(categoryOption) ? "#4caf50" : "#ffa500",
                backgroundColor: "transparent",
                padding: "5px 10px",
                fontSize: "0.9rem",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#ffa500",
                  color: "#1e1e1e",
                },
              }}
              onClick={() => handleCategoryChange(categoryOption)}
            >
              {categoryOption.charAt(0).toUpperCase() + categoryOption.slice(1)}
            </Button>
          ))
        )}

        {/* Якщо ми не на вкладці "all", додаємо кнопку видалення */}
        {category !== "all" && (
          <Button
            sx={{
              border: "1px solid #f44336",
              color: "#f44336",
              backgroundColor: "transparent",
              padding: "5px 10px",
              fontSize: "0.9rem",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#f44336",
                color: "#1e1e1e",
              },
            }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AnimeCard;
