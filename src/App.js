import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Pagination,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AnimeList from "./AnimeList";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000";

const App = () => {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("en");

  const location = useLocation();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/anime`);
        const data = response.data.map((anime) => ({
          ...anime,
          year: anime.year.match(/\d{4}/)?.[0] || "Year Unknown",
        }));
        setAnimeList(data);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };
    fetchAnime();
  }, []);

  const updateCategory = async (title, categories) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/categories`, {
        title,
        categories,
      });
      if (response.status === 200) {
        const updatedCategories = response.data.categories;
        setAnimeList((prev) =>
          prev.map((anime) =>
            anime.title === title
              ? { ...anime, categories: updatedCategories }
              : anime
          )
        );
      }
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  };

  const onDeleteAnime = async (title) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/categories`, {
        title,
        categories: [],
      });

      if (response.status === 200) {
        setAnimeList((prev) =>
          prev.map((anime) =>
            anime.title === title
              ? { ...anime, categories: [] }
              : anime
          )
        );
      }
    } catch (error) {
      console.error("Error deleting anime:", error);
    }
  };

  const filteredAnime = animeList.filter(
    (anime) =>
      (category === "all" || (anime.categories || []).includes(category)) &&
      (anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anime.year.includes(searchTerm))
  );

  const paginatedAnime = filteredAnime.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredAnime.length / rowsPerPage);

  const clearSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    const categoryFromUrl = location.pathname.split("/")[1] || "all";
    setCategory(categoryFromUrl);
    setCurrentPage(1);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <Container>
        {/* Перемикання мов */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <FormControl sx={{ width: "150px" }}>
            <InputLabel id="language-select-label" sx={{ color: "#ffa500" }}>
              Мова
            </InputLabel>
            <Select
              labelId="language-select-label"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              label="Мова"
              sx={{
                color: "#00bcd4",
                border: "1px solid #ffa500",
                "& .MuiSelect-icon": { color: "#ffa500" },
              }}
            >
              <MenuItem value="en">Англійська</MenuItem>
              <MenuItem value="ua">Українська</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Заголовок */}
        <Typography
          variant="h4"
          gutterBottom
           sx={{
            color: "#00bcd4",
            fontWeight: "bold",
            marginBottom: "40px",
            textAlign: "center", // Вирівнювання по центру
          }}
        >
          Список Аніме
        </Typography>

        {/* Фільтр категорій */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <Box>
            {["all", "favorites", "watched", "to_watch", "trash"].map((cat) => (
              <Button
                key={cat}
                component={Link}
                to={`/${cat}`}
                sx={{
                  color: category === cat ? "orange" : "#00bcd4",
                  fontWeight: "bold",
                  marginRight: "10px",
                  borderBottom: category === cat ? "2px solid #ffa500" : "none",
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </Box>

          {/* Вибір кількості рядків */}
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            sx={{
              color: "#00bcd4",
              border: "1px solid #ffa500",
              "& .MuiSelect-icon": { color: "#ffa500" },
            }}
          >
            <MenuItem value={12}>12 рядків</MenuItem>
            <MenuItem value={24}>24 рядки</MenuItem>
            <MenuItem value={48}>48 рядків</MenuItem>
          </Select>
        </Box>

        {/* Пошук */}
        <Box sx={{ position: "relative", width: "100%", marginBottom: "40px" }}>
          <TextField
            variant="outlined"
            placeholder="Шукати аніме..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "100%",
              marginBottom: "20px",
              "& .MuiOutlinedInput-root": {
                borderColor: "#ffa500",
                color: "#00bcd4",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ffa500",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ffa500",
              },
            }}
          />
          {searchTerm && (
            <IconButton
              onClick={clearSearch}
              sx={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#f44336",
              }}
            >
              <ClearIcon />
            </IconButton>
          )}
        </Box>

        {/* Список аніме */}
        <AnimeList
          animeList={paginatedAnime}
          onUpdateCategory={updateCategory}
          onDeleteAnime={onDeleteAnime}
          apiBaseUrl={API_BASE_URL}
          category={category}
        />

        {/* Пагінація */}
        <Box display="flex" justifyContent="center" mt={8}>
          <Pagination
            count={totalPages}
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

const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:category" element={<App />} />
    </Routes>
  </Router>
);

export default Root;
