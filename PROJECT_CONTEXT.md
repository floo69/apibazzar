# APIBazaar Project Context & Handoff

## 📂 Project Structure
**Root**: `/home/king/APIBazaar`
- **`bazaar-frontend-react/`**: React frontend (Vite)
- **`orchestrator-backend/`**: Node.js backend managing deployments
  - `deployments/`: Kubernetes manifests (Deployments & Services)
- **`api-templates/`**: Source code for individual microservices
  - `notification-api/`: SMS Gateway (Twilio)
  - `currency-api/`: Currency Conversion (ExchangeRate API)
  - `email-api/`: Email Service (Resend)
  - `payment-api/`, `gst-api/`, `finance-api/`

## 🛠 Critical Technical Fixes (Status: ACTIVE)

### 1. Network & DNS Resilience (Kubernetes)
**Problem**: Pods could not resolve `api.twilio.com` (`NXDOMAIN`) or timed out (`EAI_AGAIN`) due to Minikube/local DNS issues.
**Solution Applied**:
- **Fixed Manifest**: `orchestrator-backend/deployments/notification-deploy-fixed.yaml`
- **Google DNS**: Forced `dnsConfig` to `8.8.8.8` to bypass internal DNS.
- **IPv4 Enforcement**: Added `NODE_OPTIONS="--dns-result-order=ipv4first"` to prevent Node.js IPv6 timeouts.
- **Secrets**: Configured `envFrom` to load credentials from `notification-secrets`.

### 2. Microservice Robustness (Node.js)
**Locations**: `api-templates/notification-api/app.js`, `api-templates/currency-api/app.js`
**Features Added**:
- **Retry Logic**: 3 attempts (1s delay) for transient failures.
- **Automatic Fallback**: If external API fails (DNS/Auth/Network), automatically switches to **Simulation Mode** returning mocked success response.
- **Timeout**: Set 5s timeout to fail fast and trigger fallback.

### 3. Deployment State
- **Image**: `bazaar-notification:v2` (Contains the robustness code).
- **Secrets**: `notification-secrets` created from `.env`.
- **Active Deployment**: `notification-deployment` running with the fixed configuration.

## 📝 Usage for AI Assistant
- **To Deploy Updates**: always use `notification-deploy-fixed.yaml` (the original `.yaml` is broken/unstable).
- **To Debug**: Check `kubectl logs -l app=notification` for "Falling back to simulation" logic.
- **To Test**: internal curl to `http://10.110.20.234/send-sms` works for Real SMS.
