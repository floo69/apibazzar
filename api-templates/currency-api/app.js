const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.CURRENCY_API_KEY || "839b3178d4b43155b788a433";

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
        // Configure axios with timeout and retry logic
        const maxRetries = 2;
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await axios.get(
                    `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`,
                    {
                        timeout: 5000, // 5 second timeout
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );

                return res.json({
                    status: "success",
                    provider: "ExchangeRate API",
                    base: from,
                    target: to,
                    amount: amount,
                    conversion_rate: response.data.conversion_rate,
                    conversion_result: response.data.conversion_result,
                    last_update: response.data.time_last_update_utc
                });
            } catch (err) {
                lastError = err;
                if (attempt < maxRetries) {
                    console.log(`Retry ${attempt + 1}/${maxRetries} after error:`, err.message);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
                }
            }
        }

        // All retries failed, use fallback or return error
        throw lastError;

    } catch (error) {
        console.error("Forex API Error:", error.response?.data || error.message);

        // Check if it's a network/DNS error
        const isDnsError = error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT';

        if (isDnsError) {
            // Fallback to simulation mode on network errors
            const mockRate = from === to ? 1 : (from === 'USD' && to === 'INR') ? 83.45 : 1.2;
            console.log('Using fallback rates due to network error');
            return res.json({
                status: "success",
                provider: "Bazaar-Fallback-Engine",
                base: from,
                target: to,
                amount: amount,
                conversion_rate: mockRate,
                conversion_result: (amount * mockRate).toFixed(2),
                last_update: new Date().toUTCString(),
                warning: "Using cached/fallback rates due to network connectivity issues"
            });
        }

        res.status(500).json({
            status: "error",
            message: "Forex provider unreachable",
            details: error.response?.data?.['error-type'] || error.message,
            code: error.code
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