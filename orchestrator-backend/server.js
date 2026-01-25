const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
// Make sure paths correctly point to your folders
const TEMPLATE_DIR = path.join(__dirname, '../k8s-templates');
const OUTPUT_DIR = path.join(__dirname, './deployments');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const cleanupAPI = (api_name) => {
    console.log(`🧹 Cleaning up existing deployment for ${api_name}...`);
    try {
        // Deletes specific deployment and service to allow others to coexist
        execSync(`kubectl delete deployment ${api_name} --ignore-not-found`);
        execSync(`kubectl delete service ${api_name}-service --ignore-not-found`);
    } catch (e) {
        console.log(`Nothing to clean up for ${api_name}.`);
    }
};

app.post('/deploy', async (req, res) => {
    const { api_name, image_name } = req.body;
    cleanupAPI(api_name);

    if (!api_name || !image_name) {
        return res.status(400).json({ status: "error", message: "Missing api_name or image_name" });
    }

    try {
        console.log(`\n📦 Processing request for: ${api_name}`);

        // 1. Read Templates
        const deployTemplatePath = path.join(TEMPLATE_DIR, 'deployment.yaml');
        const serviceTemplatePath = path.join(TEMPLATE_DIR, 'service.yaml');

        let deploymentYaml = fs.readFileSync(deployTemplatePath, 'utf8');
        let serviceYaml = fs.readFileSync(serviceTemplatePath, 'utf8');

        // 2. Replace Placeholders (using global regex to catch all instances)
        deploymentYaml = deploymentYaml.replace(/{{API_NAME}}/g, api_name).replace(/{{IMAGE_NAME}}/g, image_name);
        serviceYaml = serviceYaml.replace(/{{API_NAME}}/g, api_name);

        // 3. Save processed YAMLs
        const deployPath = path.join(OUTPUT_DIR, `${api_name}-deploy.yaml`);
        const svcPath = path.join(OUTPUT_DIR, `${api_name}-svc.yaml`);

        fs.writeFileSync(deployPath, deploymentYaml);
        fs.writeFileSync(svcPath, serviceYaml);

        // 4. Apply to Kubernetes
        console.log(`🚀 Applying manifests to cluster...`);
        execSync(`kubectl apply -f ${deployPath}`);
        execSync(`kubectl apply -f ${svcPath}`);

        // 5. Retry Logic for URL
        let serviceUrl = "";
        let attempts = 0;
        const maxAttempts = 12; // Gives it about 45-60 seconds total

        console.log("⏳ Waiting for Pod to be 'Running' and Service to be reachable...");

        while (attempts < maxAttempts) {
            try {
                // Wait 5 seconds between checks
                execSync('sleep 5');

                // minikube service --url can fail if pod isn't ready, so we pipe to catch errors
                const output = execSync(`minikube service ${api_name}-service --url`, { stdio: 'pipe' }).toString();

                if (output && output.includes("http")) {
                    serviceUrl = output.trim();
                    break;
                }
            } catch (e) {
                attempts++;
                console.log(`🔄 Attempt ${attempts}/${maxAttempts}: Pod is initializing...`);
            }
        }

        if (!serviceUrl) {
            throw new Error("Kubernetes timeout: Pod is taking too long to start. Please check 'kubectl get pods'.");
        }

        console.log(`✅ Deployment Complete: ${serviceUrl}`);

        // Define specific test endpoints for different APIs
        let finalUrl = serviceUrl;
        if (api_name === 'currency') {
            finalUrl = `${serviceUrl}/convert/USD/INR`;
        } else if (api_name === 'notification') {
            finalUrl = `${serviceUrl}/send-sms`;
        } else if (api_name === 'email') {
            finalUrl = `${serviceUrl}/send-email`;
        } else if (api_name === 'finance') {
            finalUrl = `${serviceUrl}/stock-price`;
        }

        res.json({
            status: "success",
            api: api_name,
            url: finalUrl
        });

    } catch (error) {
        console.error("❌ Deployment Failed:", error.message);
        res.status(500).json({ status: "error", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 APIBazaar Brain running at http://localhost:${PORT}`);
    console.log(`📂 Templates: ${TEMPLATE_DIR}`);
    console.log(`-----------------------------------------`);
});