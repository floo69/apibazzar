# API Playground - Quick Start Guide

## Access the Playground

1. Navigate to your APIBazaar app (http://localhost:5173)
2. Click the **🧪 Playground** button in the header
3. You'll be taken to the API Playground interface

## How to Test an API

### Step 1: Deploy an API First
Before using the playground, you need to deploy an API:
1. Go back to the main page
2. Select an API from the catalog (e.g., "Payment Processing")
3. Click "Deploy to Kubernetes"
4. **Copy the deployed URL** (e.g., `http://192.168.49.2:30001`)

### Step 2: Configure Your Request

In the playground:

1. **Select API Service**
   - Click the dropdown at the top
   - Choose the API you want to test

2. **Enter Deployed URL**
   - Paste the URL you copied from deployment
   - Example: `http://192.168.49.2:30001`

3. **Choose HTTP Method**
   - Click one of: GET, POST, PUT, DELETE, PATCH
   - Default is set based on the API

4. **Fill in Parameters**
   - Each API has different fields
   - Example for Payment API:
     - Amount: `49.99`
     - Currency: `USD`

5. **Add Headers (Optional)**
   - Click "+ Add Header"
   - Enter key-value pairs
   - Example: `Authorization: Bearer token123`

6. **Edit Request Body (for POST/PUT/PATCH)**
   - JSON editor appears automatically
   - Modify the pre-populated JSON
   - Must be valid JSON

### Step 3: Send Request

1. Click the **Send Request** button
2. Wait for the response (loading indicator shows)
3. View the results:
   - **Status**: HTTP status code (colored)
   - **Time**: Response time in milliseconds
   - **Body**: Formatted JSON response

### Step 4: Iterate & Test

- Modify parameters and send again
- Try different HTTP methods
- Test error scenarios
- Click "Copy" to copy the response

## Example: Testing Payment API

```
1. Select: "Payment Processing - Stripe Connect"
2. URL: http://192.168.49.2:30001
3. Method: POST
4. Parameters:
   - amount: 49.99
   - currency: USD
5. Click "Send Request"

Response:
Status: 200 OK
Time: 118ms
Body: {
  "status": "success",
  "transactionId": "TXN-847291",
  "amount": "49.99",
  "currency": "USD"
}
```

## Supported APIs

Currently configured APIs:
- ✉️ Email Service (Resend)
- 📱 SMS Gateway (Twilio)
- 💱 Live Currency API
- 💳 Payment Processing
- 📈 Stock Market API
- 🎬 TMDB Movie Database

## Tips

- **Save URLs**: The playground stores deployed URLs in localStorage
- **Headers**: Default Content-Type is already set
- **Errors**: Network errors and API errors are both displayed
- **Copy**: Use the copy button to save responses
- **Navigation**: Click the back arrow to return to main page

## Troubleshooting

**"Please select an API and ensure it is deployed"**
- You need to deploy the API first from the main page
- Make sure you've pasted the deployed URL

**"Invalid JSON in request body"**
- Check your JSON syntax in the body editor
- Make sure all quotes and brackets are matched

**"Network Error"**
- Verify the deployed URL is correct
- Check if the API pod is running: `kubectl get pods`
- Ensure minikube is running

**Status 404 or 500**
- Check the endpoint path is correct
- Verify the API is deployed and running
- Check API logs for errors

## Next Steps

Once you're comfortable with the playground:
- Test all your deployed APIs
- Experiment with different parameters
- Try error scenarios
- Use responses to build your applications

Enjoy testing! 🚀
