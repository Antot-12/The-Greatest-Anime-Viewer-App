import React from "react";
import { Box } from "@mui/material";
import AnimeCard from "./AnimeCard";

const AnimeList = ({ animeList, onUpdateCategory, onDeleteAnime, apiBaseUrl, category }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // 3 стовпці
        gap: "60px 10px", // Вертикальний gap 30px, горизонтальний gap 50px
        justifyItems: "center", // Центрування карток по горизонталі
        paddingBottom: "80px", // Більший відступ знизу контейнера
        marginTop: "40px", // Додано більший відступ зверху
      }}
    >
      {animeList.map((anime) => (
        <AnimeCard
          key={anime.title}
          anime={anime}
          onUpdateCategory={onUpdateCategory}
          onDeleteAnime={onDeleteAnime}
          apiBaseUrl={apiBaseUrl}
          category={category}
        />
      ))}
    </Box>
  );
};

export default AnimeList;
