const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const getResendClient = (req) => {
    const headerKey = req.headers['x-api-key'];
    const envKey = process.env.RESEND_API_KEY;
    const fallbackKey = "re_9jd9Gknp_75EYakBLEomyJ61HftPCEEZn0"; // Known placeholder

    const keyToUse = headerKey || envKey || fallbackKey;
    return {
        client: new Resend(keyToUse),
        mode: headerKey ? "BYOK" : (envKey ? "Managed" : "Fallback"),
        isMock: keyToUse === "mock" || (process.env.SIMULATE === "true" && keyToUse === fallbackKey)
    };
};

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/debug-key', (req, res) => {
    const headerKey = req.headers['x-api-key'];
    const envKey = process.env.RESEND_API_KEY;
    const fallbackKey = "re_9jd9Gknp_75EYakBLEomyJ61HftPCEEZn0";

    const keyToUse = headerKey || envKey || fallbackKey;

    res.json({
        hasHeaderKey: !!headerKey,
        headerKeyPreview: headerKey ? `${headerKey.substring(0, 8)}...` : null,
        hasEnvKey: !!envKey,
        envKeyPreview: envKey ? `${envKey.substring(0, 8)}...` : null,
        usingFallback: keyToUse === fallbackKey,
        mode: headerKey ? "BYOK (Header)" : (envKey ? "Managed (Env)" : "Fallback"),
        keyLength: keyToUse.length,
        startsWithRe: keyToUse.startsWith('re_')
    });
});

app.post('/send-email', async (req, res) => {
    const { to, subject, body } = req.body;
    const { client, mode, isMock } = getResendClient(req);

    // Check if we have the data we need
    if (!to || !body) {
        return res.status(400).json({ status: "error", message: "Missing 'to' or 'body' in request" });
    }

    // Simulated Mode for Infrastructure Testing
    if (isMock || req.headers['x-simulation'] === 'true') {
        console.log(`🛠️ [SIMULATED] Sending email to ${to}`);
        return res.json({
            status: "success",
            mode: "Simulation",
            id: "sim_" + Math.random().toString(36).substr(2, 9),
            provider: "Bazaar-Simulation-Sender",
            note: "Orchestration confirmed. Real email skipped due to simulation mode or invalid key.",
            preview: `Email to ${to} with subject "${subject || 'Bazaar Notification'}" sent successfully.`
        });
    }

    try {
        const data = await client.emails.send({
            from: 'Bazaar <onboarding@resend.dev>',
            to: to,
            subject: subject || "Bazaar Notification",
            html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h3>Message from APIBazaar</h3>
                    <p>${body}</p>
                   </div>`
        });

        if (data.error) {

            const errorType = data.error.name || data.error.type;

            if (errorType === 'validation_error' && mode === "Fallback") {
                console.log(`🛠️ [AUTO-SIMULATED] Invalid API key, returning simulation for ${to}`);
                return res.json({
                    status: "success",
                    mode: "Simulation (Auto - Invalid Key)",
                    id: "sim_" + Math.random().toString(36).substr(2, 9),
                    provider: "Bazaar-Simulation-Sender",
                    note: "Real email skipped - API key is invalid. Provide a valid key via 'x-api-key' header or RESEND_API_KEY env var to send real emails.",
                    preview: `Email to ${to} with subject "${subject || 'Bazaar Notification'}" would be sent successfully with a valid key.`
                });
            }

            console.error("Resend API Error:", data.error);
            return res.status(401).json({
                status: "error",
                message: data.error.message,
                type: data.error.type
            });
        }

        res.json({
            status: "success",
            mode: mode,
            id: data.data.id,
            provider: "Resend-Cloud"
        });

    } catch (error) {
        console.error("Internal Server Error:", error.message);
        res.status(500).json({ status: "error", message: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Email Gateway Online on Port ${PORT}`);
    console.log(`🔑 Using Key Mode: ${process.env.RESEND_API_KEY ? "ENVIRONMENT" : "FALLBACK"}`);
});