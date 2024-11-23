import React from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";

const AnimeCard = ({ anime, onUpdateCategory, currentTab, apiBaseUrl }) => {
  const truncatedSummary =
    anime.summary && anime.summary.length > 350
      ? anime.summary.substring(0, 350) + "..."
      : anime.summary;

  // Витягуємо рік випуску
  const releaseYear = anime.year || "Year Unknown";

  // Кількість серій
  const episodes = anime.series_info || "Episodes Unknown";

  // Генеруємо пояснення до оцінки
  const getRatingExplanation = (rating) => {
    if (rating >= 9) return "Masterpiece";
    if (rating >= 7) return "Very Good";
    if (rating >= 5) return "Average";
    if (rating >= 3) return "Below Average";
    return "Poor";
  };

  const ratingExplanation = getRatingExplanation(anime.rating || 0);

  // Список кнопок, виключаючи поточну категорію
  const availableCategories = ["favorites", "watched", "to_watch", "trash"];
  const buttonsToRender = availableCategories.filter((category) => category !== currentTab);

  return (
    <Box
      sx={{
        backgroundColor: "#2b2b2b",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center",
        border: "1px solid #ffa500",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: "30px",
      }}
    >
      {/* Оцінка із поясненням */}
      <Tooltip title={`Rating: ${ratingExplanation}`} arrow>
        <Typography
          variant="h6"
          sx={{
            color: anime.rating >= 7 ? "#4caf50" : anime.rating >= 5 ? "#ff9800" : "#f44336", // Залежно від оцінки
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Оцінка: {anime.rating || "N/A"}
        </Typography>
      </Tooltip>

      {/* Зображення з лінком */}
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
            borderRadius: "10px",
            marginBottom: "10px",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
          }}
        />
      </a>

      {/* Назва */}
      <Typography
        variant="body1"
        sx={{
          color: "#00bcd4",
          fontWeight: "bold",
          marginBottom: "5px",
        }}
      >
        {anime.title}
      </Typography>

      {/* Рік випуску та кількість серій */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <Typography
          variant="body1"
          sx={{
            color: "#ffa500", // Помаранчевий для року
            fontWeight: "bold",
          }}
        >
          {`Year: ${releaseYear}`}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#ffa500", // Помаранчевий для серій
            fontWeight: "bold",
          }}
        >
          {episodes}
        </Typography>
      </Box>

      {/* Опис */}
      <Typography
        variant="body2"
        sx={{
          color: "#0097aa",
          fontWeight: "lighter",
          marginBottom: "10px",
        }}
      >
        {truncatedSummary || "No description available."}
      </Typography>

      {/* Кнопки */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "10px" }}>
        {buttonsToRender.map((category) => (
          <Button
            key={category}
            sx={{
              border: "1px solid #ffa500",
              color: "#ffa500",
              flex: "1 1 calc(50% - 10px)",
              padding: "5px 10px",
            }}
            onClick={() => onUpdateCategory(anime.title, category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
        {/* Кнопка Delete тільки у вкладках, окрім All */}
        {currentTab !== "all" && (
          <Button
            sx={{
              border: "1px solid #ffa500",
              color: "#ffa500",
              flex: "1 1 calc(50% - 10px)",
              padding: "5px 10px",
            }}
            onClick={() => onUpdateCategory(anime.title, "delete")}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AnimeCard;
