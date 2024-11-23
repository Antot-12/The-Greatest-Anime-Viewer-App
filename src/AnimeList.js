import React from "react";
import { Grid } from "@mui/material";
import AnimeCard from "./AnimeCard";

const AnimeList = ({ animeList, currentTab, onUpdateCategory, apiBaseUrl }) => {
  return (
    <Grid container rowSpacing={8} columnSpacing={2}>
      {animeList.map((anime, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <AnimeCard
            anime={anime}
            currentTab={currentTab} // Передаємо поточну вкладку
            onUpdateCategory={onUpdateCategory}
            apiBaseUrl={apiBaseUrl}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AnimeList;
