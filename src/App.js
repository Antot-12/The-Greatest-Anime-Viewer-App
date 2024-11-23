import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, useSearchParams } from "react-router-dom";
import { Button, Typography, Container, Box, Pagination, Select, MenuItem } from "@mui/material";
import AnimeList from "./AnimeList";

const API_BASE_URL = "http://127.0.0.1:5000";

const App = () => {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all"; // Зчитування категорії з URL
  const [category, setCategory] = useState(categoryFromUrl);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/anime`)
      .then((response) => {
        const data = response.data.map((anime) => ({
          ...anime,
          year: anime.year.match(/\d{4}/)?.[0] || "Year Unknown", // Витягуємо рік із `series_info`
        }));
        setAnimeList(data);
      })
      .catch((err) => console.error("Error fetching anime data:", err));
  }, []);

  useEffect(() => {
    setSearchParams({ category }); // Синхронізація стану з URL
  }, [category, setSearchParams]);

  // Динамічне оновлення назви сторінки
  useEffect(() => {
    const categoryTitles = {
      all: "All Anime",
      favorites: "Favorites",
      watched: "Watched",
      to_watch: "To Watch",
      trash: "Trash",
    };
    const pageTitle = categoryTitles[category] || "Anime Viewer";
    document.title = `The Greatest Anime Viewer App | ${pageTitle}`;
  }, [category]);

  const updateCategory = (title, newCategory) => {
    axios
      .post(`${API_BASE_URL}/api/categories`, { title, category: newCategory })
      .then(() => {
        setAnimeList((prev) =>
          prev.map((anime) =>
            anime.title === title ? { ...anime, category: newCategory } : anime
          )
        );
      })
      .catch((err) => console.error("Error updating category:", err));
  };

  const filteredAnime =
    category === "all"
      ? animeList
      : animeList.filter((anime) => anime.category === category);

  const totalRows = Math.ceil(filteredAnime.length / rowsPerPage);
  const paginatedAnime = filteredAnime.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box
      sx={{
        backgroundColor: "#1e1e1e", // Темно-сірий фон
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#00bcd4", // Темно-бірюзовий текст
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Anime List
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            {["all", "favorites", "watched", "to_watch", "trash"].map((cat) => (
              <Button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
                sx={{
                  color: category === cat ? "orange" : "#00bcd4",
                  fontWeight: "bold",
                  marginRight: "10px",
                  borderBottom: category === cat ? "2px solid #ffa500" : "none", // Виділення
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </Box>
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
            sx={{
              color: "#00bcd4",
              border: "1px solid #ffa500",
              "& .MuiSelect-icon": { color: "#ffa500" }, // Колір іконки
            }}
          >
            <MenuItem value={12}>12 rows</MenuItem>
            <MenuItem value={15}>15 rows</MenuItem>
            <MenuItem value={20}>20 rows</MenuItem>
          </Select>
        </Box>

        {/* Передача currentTab у AnimeList */}
        <AnimeList
          animeList={paginatedAnime}
          currentTab={category} // Передаємо поточну вкладку
          onUpdateCategory={updateCategory}
          apiBaseUrl={API_BASE_URL}
        />

        <Box display="flex" justifyContent="center" mt={8}>
          <Pagination
            count={totalRows}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            sx={{
              "& .Mui-selected": {
                backgroundColor: "#ffa500 !important",
                color: "#1e1e1e !important",
              },
              "& .MuiPaginationItem-root": {
                color: "#00bcd4",
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);
