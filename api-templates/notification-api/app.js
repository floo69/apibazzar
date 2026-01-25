const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const app = express();
app.use(cors());
app.use(express.json());

// Dual-Mode Credentials
const accountSid = process.env.TWILIO_SID || 'AC8b0b5e79b3e5767839a8a674acf819c9';
const authToken = process.env.TWILIO_TOKEN || 'df02254f8d5ce9664cfc48beaf49f3e6';
const client = twilio(accountSid, authToken);

app.post('/send-sms', async (req, res) => {
    const { to, message } = req.body;
    // Simulation Mode
    if (req.headers['x-simulation'] === 'true') {
        return res.json({
            status: "success",
            mode: "Simulation",
            sid: "SM" + Math.random().toString(16).substr(2, 32),
            sent_at: new Date().toISOString(),
            provider: "Bazaar-Simulation-Sender",
            note: "SMS queued in simulation mode. No real SMS sent."
        });
    }

    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE || '+19706494445',
            to: to
        });
        res.json({
            status: "success",
            mode: process.env.TWILIO_SID ? "BYOK" : "Managed",
            sid: response.sid,
            sent_at: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Health check for Kubernetes
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(3000, () => console.log('Twilio Gateway Online'));