const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        service: "APIBazaar Managed Container",
        status: "Active",
        message: "Use specific endpoints like /pay or /lookup to interact with this API.",
        owner: "Aeldosh D'costa"
    });
});


app.post('/pay', (req, res) => {
    const isSimulation = req.headers['x-simulation'] === 'true';

    res.json({
        status: "success",
        mode: isSimulation ? "Simulation" : "Production-Mock",
        transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
        amount: req.body.amount || "0.00",
        currency: req.body.currency || "USD",
        message: isSimulation ? "Simulated payment successful" : "Payment processed via APIBazaar Mock"
    });
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => console.log(`Payment API running on port ${PORT}`));