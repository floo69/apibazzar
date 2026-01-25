const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const mockGstData = {
  "27AAACV9876F1Z1": {
    business_name: "Aeldosh Tech Solutions",
    status: "Active",
    registration_date: "2024-05-12",
    taxpayer_type: "Regular",
    address: "Thane, Maharashtra, 400601"
  }
};

app.get('/lookup/:gstin', (req, res) => {
  const gstin = req.params.gstin.toUpperCase();
  const data = mockGstData[gstin];

  // Simulation Mode
  if (req.headers['x-simulation'] === 'true' && !data) {
    return res.json({
      success: true,
      mode: "simulation",
      data: {
        business_name: "Simulated Enterprise Ltd",
        status: "Active",
        registration_date: "2023-01-15",
        taxpayer_type: "Regular",
        address: "Digital Twin Tower, Cyber Hub, Gurgaon, 122002"
      }
    });
  }

  if (data) {
    res.json({ success: true, data });
  } else {
    res.status(404).json({
      success: false,
      message: "GSTIN not found in mock database. Try: 27AAACV9876F1Z1"
    });
  }
});

// Health check for Kubernetes
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => console.log(`GST API running on port ${PORT}`));