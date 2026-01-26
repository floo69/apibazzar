const { Resend } = require('resend');

const key = "re_9jd9Gknp_75EYakBLEomyJ61HftPCEEZn0";
console.log(`Testing API Key: ${key}`);

const resend = new Resend(key);

async function verify() {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'delivered@resend.dev',
            subject: 'API Key Verification',
            html: '<p>Testing key validity</p>'
        });

        if (data.error) {
            console.error("\n❌ API Key is INVALID or REVOKED");
            console.error("Error details:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("\n✅ API Key is VALID");
            console.log("Email ID:", data.data.id);
        }
    } catch (error) {
        console.error("\n❌ Exception occurred:");
        console.error(error);
    }
}

verify();
