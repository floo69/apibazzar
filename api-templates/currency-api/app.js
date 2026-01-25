const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "839b3178d4b43155b788a433";

// Enhanced conversion function
const handleConversion = async (req, res) => {
    const from = req.params.from || req.query.from || 'USD';
    const to = req.params.to || req.query.to || 'INR';
    const amount = parseFloat(req.query.amount) || 1;

    // Simulation Mode
    if (req.headers['x-simulation'] === 'true') {
        const mockRate = from === to ? 1 : 83.45;
        return res.json({
            status: "success",
            provider: "Bazaar-Simulation-Engine",
            base: from,
            target: to,
            amount: amount,
            conversion_rate: mockRate,
            conversion_result: (amount * mockRate).toFixed(2),
            last_update: new Date().toUTCString()
        });
    }

    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`);

        res.json({
            status: "success",
            provider: "ExchangeRate API",
            base: from,
            target: to,
            amount: amount,
            conversion_rate: response.data.conversion_rate,
            conversion_result: response.data.conversion_result,
            last_update: response.data.time_last_update_utc
        });
    } catch (error) {
        console.error("Forex API Error:", error.response?.data || error.message);
        res.status(500).json({
            status: "error",
            message: "Forex provider unreachable",
            details: error.response?.data?.['error-type'] || error.message
        });
    }
};

// Route support both path params and query params
app.get('/convert/:from/:to', handleConversion);
app.get('/convert', handleConversion);

app.get('/', (req, res) => {
    res.send("<h1>Currency API Live</h1><p>Try: /convert/USD/INR?amount=100 or /convert?from=USD&to=INR&amount=100</p>");
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(3000, () => console.log('Currency API on port 3000'));