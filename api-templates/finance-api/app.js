const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const ALPHA_VANTAGE_KEY = process.env.FINANCE_API_KEY || "GVYZKUTAUYHE0Q06";

// Simple cache to save your 25 daily requests
let cache = { data: null, lastFetch: 0 };

app.get('/stock-price', async (req, res) => {
    const symbol = req.query.symbol || 'IBM'; // Default to IBM if no symbol provided
    const now = Date.now();

    // Simulation Mode
    if (req.headers['x-simulation'] === 'true') {
        return res.json({
            status: "success",
            source: "simulation",
            data: {
                "01. symbol": symbol,
                "02. open": "150.00",
                "03. high": "155.50",
                "04. low": "148.20",
                "05. price": "153.25",
                "06. volume": "1200000",
                "07. latest trading day": new Date().toISOString().split('T')[0],
                "08. previous close": "149.80",
                "09. change": "3.45",
                "10. change percent": "2.30%"
            }
        });
    }

    // If we fetched data less than 10 minutes ago, return the cached version
    if (cache.data && (now - cache.lastFetch < 600000)) {
        return res.json({ status: "success", source: "cache", data: cache.data });
    }

    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
        const response = await axios.get(url);

        const data = response.data["Global Quote"];

        if (!data || Object.keys(data).length === 0) {
            throw new Error("Limit reached or Invalid Symbol");
        }

        cache = { data, lastFetch: now };
        res.json({ status: "success", source: "live-api", data });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Alpha Vantage Limit Reached (25/day)" });
    }
});

// Health check for Kubernetes
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(3000, () => console.log('Finance Gateway Online on Port 3000'));