async function deployAPI(name, imageName) {
    const statusContainer = document.getElementById('status-container');
    const statusText = document.getElementById('status-text');
    const urlContainer = document.getElementById('url-container');
    const apiUrl = document.getElementById('api-url');
    const btn = document.getElementById(`btn-${name}`);

    // UI Feedback
    statusContainer.classList.remove('hidden');
    urlContainer.classList.add('hidden');
    statusText.innerText = `🚀 Triggering K8s for ${name}... (This takes ~30-45s)`;
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const response = await fetch('http://localhost:5000/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_name: name, image_name: imageName })
        });

        const data = await response.json();

        if (data.status === "success") {
            statusText.innerText = "✅ Deployed Successfully!";
            urlContainer.classList.remove('hidden');
            apiUrl.href = data.url;
            apiUrl.innerText = data.url;
        } else {
            statusText.innerText = "❌ Error: " + data.message;
        }
    } catch (error) {
        statusText.innerText = "❌ Failed to connect to the Orchestrator.";
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}