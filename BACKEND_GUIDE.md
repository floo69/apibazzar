# APIBazaar Backend Operations Guide

## 1. Running the Orchestrator
The orchestrator handles YAML transformation and Kubernetes deployment.
```bash
cd /home/king/APIBazaar/orchestrator-backend
node server.js
```

## 2. Building API Images
Images must be built inside Minikube's Docker environment so Kubernetes can find them.
```bash
# Point shell to Minikube
eval $(minikube docker-env)

# Build Notification API
cd ~/APIBazaar/api-templates/notification-api
docker build -t bazaar-notification:latest .

# Build Email API
cd ~/APIBazaar/api-templates/email-api
docker build -t bazaar-email:latest .

# Build Currency API
cd ~/APIBazaar/api-templates/currency-api
docker build -t bazaar-currency:latest .
```

## 3. Manual API Testing (Postman/Curl)
Once deployed, you can test the APIs directly using `curl`.

### Notification API (POST)
```bash
curl -X POST http://<DEPLOYED_IP>:<PORT>/send-sms \
     -H "Content-Type: application/json" \
     -d '{"to": "+91XXXXXXXXXX", "message": "Hello from APIBazaar!"}'
```

### Currency API (GET)
```bash
curl http://<DEPLOYED_IP>:<PORT>/convert/USD/INR
```

## 4. Troubleshooting Minikube Tunnel
If `minikube tunnel` shows `connection refused`:

1.  **Check Status**: Ensure minikube is running: `minikube status`.
2.  **Reset Tunnel**: Sometimes a stale PID file causes issues.
    ```bash
    minikube tunnel --cleanup
    ```
3.  **Check Docker Bridge**: If using the Docker driver, the tunnel needs to route through the docker bridge. Ensure you aren't running behind a strict VPN/Proxy.
4.  **Try Port Forwarding**: If the tunnel fails, you can manually expose a service:
    ```bash
    kubectl port-forward service/notification-service 3000:3000
    ```
    Then access it at `http://localhost:3000/send-sms`.

### New Feature: Email Gateway

I've also integrated the **Resend Email Gateway** into the dashboard.

### Key Additions:
1. **Email UI Card**: Added a dedicated card for the Email Gateway.
2. **Updated Layout**: Expanded the dashboard to a 5-column grid layout for a seamless experience.
3. **Orchestrator Support**: The orchestrator now maps the `/send-email` endpoint correctly.

### How to Test Email API:
1. Ensure your orchestrator backend is running.
2. Click **"Deploy to K8s"** on the **Email Gateway** card.
3. Once live, use the provided endpoint to send emails via Resend.

---

## Technical Lessons & Fixes
- **Base Port**: Most APIs listen on `3000` inside the container.
- **NodePort**: Minikube exposes them on high ports (e.g., `30XXX`).
- **Cleanup**: The orchestrator runs `kubectl delete deployments,services --all` before every new deployment to keep your system lightweight.
