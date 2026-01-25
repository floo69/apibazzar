const express = require('express');
const { Resend } = require('resend');
const app = express();
app.use(express.json());

// Priority: 1. Header (x-api-key) | 2. Environment Variable (K8s) | 3. Hardcoded fallback
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

// IMPORTANT: Kubernetes LivenessProbe needs this /health endpoint!
app.get('/health', (req, res) => {
    res.status(200).send('OK');
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
            // If it's a validation error and we are in fallback mode, suggest BYOK
            // Resend SDK errors use 'name' instead of 'type'
            const errorType = data.error.name || data.error.type;

            if (errorType === 'validation_error' && mode === "Fallback") {
                return res.status(401).json({
                    status: "error",
                    message: "Resend API Key is invalid. Please provide a valid key via 'x-api-key' header or set RESEND_API_KEY env var.",
                    type: "auth_required",
                    hint: "To bypass this for orchestration testing, use 'mock' as the x-api-key header."
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