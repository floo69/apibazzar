const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Pull keys from environment (Injected by K8s or .env)
const MOVIE_API_TOKEN = process.env.MOVIE_API_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// 1. K8s Health Check (Critical for preventing crash loops)
app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy", service: "movie-gateway" });
});

// Root Route
app.get('/', (req, res) => {
    res.json({ status: "online", service: "movie-gateway" });
});

// 2. Search Movies Endpoint (Aliased for frontend compatibility)
app.get(['/search', '/search-movie'], async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Missing search query '?q='" });

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: { query: query, language: 'en-US', page: 1 },
            headers: {
                Authorization: `Bearer ${MOVIE_API_TOKEN}`,
                accept: 'application/json'
            }
        });
        res.json({ status: "success", results: response.data.results });
    } catch (error) {
        console.error("TMDB Error:", error.response?.data || error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch from TMDB" });
    }
});

// 3. Trending Movies Endpoint
app.get('/trending', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
            headers: {
                Authorization: `Bearer ${MOVIE_API_TOKEN}`,
                accept: 'application/json'
            }
        });
        res.json({ status: "success", data: response.data.results.slice(0, 10) });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// 4. Search Movie by Name and Year (for UI testing)
app.get('/trending/search-movie', async (req, res) => {
    // Accept multiple parameter name variations for flexibility
    const movieName = req.query.movieName || req.query.q || req.query.movie ||
        req.query.name || req.query.query || req.query.title;
    const year = req.query.year;

    if (!movieName) {
        console.log('Received query params:', req.query);
        return res.status(400).json({
            error: "Missing movie name parameter",
            hint: "Use 'movieName', 'q', 'movie', 'name', 'query', or 'title' parameter",
            received_params: Object.keys(req.query)
        });
    }

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                query: movieName,
                language: 'en-US',
                page: 1,
                ...(year && { year: year })
            },
            headers: {
                Authorization: `Bearer ${MOVIE_API_TOKEN}`,
                accept: 'application/json'
            }
        });

        res.json({
            status: "success",
            results: response.data.results,
            total_results: response.data.total_results
        });
    } catch (error) {
        console.error("TMDB Error:", error.response?.data || error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch from TMDB" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🎬 Movie Gateway Online on Port ${PORT}`);
    console.log(`🔑 Token Status: ${MOVIE_API_TOKEN ? "LOADED" : "MISSING"}`);
});