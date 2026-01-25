// Terminal-like logging function
let isDeploying = false;
function addLog(message, type = 'info') {
    const logContainer = document.getElementById('deployment-log');
    const logEntry = document.createElement('div');
    logEntry.className = 'mb-1';

    const timestamp = new Date().toLocaleTimeString();
    const colors = {
        info: 'text-blue-400',
        success: 'text-emerald-400',
        error: 'text-red-400',
        warning: 'text-yellow-400'
    };

    logEntry.innerHTML = `<span class="text-gray-600">[${timestamp}]</span> <span class="${colors[type]}">${message}</span>`;
    logContainer.appendChild(logEntry);

    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
}

function clearDeploymentLog() {
    if (isDeploying) {
        addLog('⚠️ Cannot clear log during active deployment', 'warning');
        return;
    }
    const logContainer = document.getElementById('deployment-log');
    logContainer.innerHTML = '<div class="text-gray-500">Waiting for deployment...</div>';
    document.getElementById('endpoint-display').classList.add('hidden');
    document.getElementById('real-data-display').classList.add('hidden');
}

function disableAllButtons() {
    ['payment', 'gst', 'currency', 'notification', 'email'].forEach(name => {
        const btn = document.getElementById(`btn-${name}`);
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    });
}

function enableAllButtons() {
    ['payment', 'gst', 'currency', 'notification', 'email'].forEach(name => {
        const btn = document.getElementById(`btn-${name}`);
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}

async function deployAPI(name, imageName) {
    console.log('🔍 DEBUG: deployAPI called with:', name, imageName);

    // Prevent multiple simultaneous deployments
    if (isDeploying) {
        console.log('🔍 DEBUG: Already deploying, blocking...');
        addLog('⚠️ Another deployment is in progress, please wait...', 'warning');
        return;
    }

    const deploymentStatus = document.getElementById('deployment-status');
    const endpointDisplay = document.getElementById('endpoint-display');
    const apiUrl = document.getElementById('api-url');

    console.log('🔍 DEBUG: Got DOM elements:', {
        deploymentStatus: !!deploymentStatus,
        endpointDisplay: !!endpointDisplay,
        apiUrl: !!apiUrl
    });

    // Set deploying state
    isDeploying = true;
    console.log('🔍 DEBUG: Set isDeploying = true');

    // Show deployment console
    deploymentStatus.classList.remove('hidden');
    console.log('🔍 DEBUG: Showed deployment console');

    endpointDisplay.classList.add('hidden');
    document.getElementById('real-data-display').classList.add('hidden');

    // Clear previous logs only if not deploying
    const logContainer = document.getElementById('deployment-log');
    logContainer.innerHTML = '';

    // Disable all buttons during deployment
    disableAllButtons();

    // UI Feedback
    addLog(`🚀 Initiating deployment for <strong>${name}</strong> API...`, 'info');
    addLog(`📦 Image: ${imageName}`, 'info');

    try {
        addLog('🔌 Connecting to orchestrator backend...', 'info');

        const response = await fetch('http://localhost:5000/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_name: name, image_name: imageName })
        });

        addLog('📡 Received response from orchestrator', 'success');
        const data = await response.json();
        console.log('🔍 DEBUG: Response data:', data);

        if (data.status === "success") {
            console.log('🔍 DEBUG: Deployment successful!');
            addLog('✅ Deployment successful!', 'success');
            addLog(`🌐 Service is now live at: ${data.url}`, 'success');

            // Show API endpoint
            console.log('🔍 DEBUG: About to show endpoint display...');
            endpointDisplay.classList.remove('hidden');
            console.log('🔍 DEBUG: Endpoint display should now be visible');
            console.log('🔍 DEBUG: endpointDisplay classes:', endpointDisplay.className);

            // Set the display URL (avoid double-appending if backend already provides the full path)
            const displayUrl = (name === 'currency' && !data.url.includes('/convert/USD/INR'))
                ? `${data.url}/convert/USD/INR`
                : data.url;

            apiUrl.href = displayUrl;
            apiUrl.innerText = displayUrl;
            console.log('🔍 DEBUG: Set API URL to:', displayUrl);

            // If it's the real-world currency API, fetch the data to show off
            if (name === 'currency') {
                const dataDisplay = document.getElementById('real-data-display');
                const rateValue = document.getElementById('live-rate');
                const timeValue = document.getElementById('live-time');

                dataDisplay.classList.remove('hidden');
                rateValue.innerText = "Connecting to Forex...";

                addLog('💱 Fetching live forex data...', 'info');

                // Call the newly deployed container!
                fetch(displayUrl)
                    .then(res => res.json())
                    .then(finData => {
                        rateValue.innerText = `₹${finData.conversion_rate.toFixed(2)}`;
                        timeValue.innerText = `Last updated: ${finData.last_update}`;
                        addLog(`💰 Live rate: ₹${finData.conversion_rate.toFixed(2)}`, 'success');
                    })
                    .catch(err => {
                        rateValue.innerText = "Data Fetch Error";
                        addLog(`❌ Failed to fetch forex data: ${err.message}`, 'error');
                        console.error("Fetch error:", err);
                    });
            }
        } else {
            console.log('🔍 DEBUG: Deployment failed:', data.message);
            addLog(`❌ Deployment failed: ${data.message}`, 'error');
        }
    } catch (error) {
        console.log('🔍 DEBUG: Caught error:', error);
        addLog(`❌ Failed to connect to orchestrator: ${error.message}`, 'error');
        console.error(error);
    } finally {
        console.log('🔍 DEBUG: In finally block, re-enabling buttons...');
        // Re-enable all buttons
        enableAllButtons();
        isDeploying = false;
        console.log('🔍 DEBUG: Set isDeploying = false, deployment complete');
    }
}