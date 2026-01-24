const express = require('express');
const app = express();
const PORT = 3000;

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
    res.json({
        status: "success",
        transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
        message: "Payment processed via APIBazaar Mock"
    });
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => console.log(`Payment API running on port ${PORT}`));