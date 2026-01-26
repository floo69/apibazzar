import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Copy, Check, ChevronDown, Plus, X, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

// Import the same AVAILABLE_APIS configuration
const AVAILABLE_APIS = [
    {
        id: 'email',
        imageName: 'bazaar-email',
        name: 'Email Service',
        provider: 'Resend',
        description: 'Send transactional and marketing emails with analytics and templates',
        category: 'Communication',
        testConfig: {
            method: 'POST',
            endpoint: '/send-email',
            fields: [
                { name: 'to', label: 'To', placeholder: 'recipient@example.com', type: 'email' },
                { name: 'subject', label: 'Subject', placeholder: 'Hello from Bazaar!', type: 'text' },
                { name: 'body', label: 'Body', placeholder: 'Enter your message here...', type: 'textarea' }
            ]
        }
    },
    {
        id: 'currency',
        imageName: 'bazaar-currency',
        name: 'Live Currency API',
        provider: 'ExchangeRate API',
        description: 'Real-time Forex data and currency conversion for 170+ currencies',
        category: 'Finance',
        testConfig: {
            method: 'GET',
            endpoint: '/convert',
            usePathParams: true,
            fields: [
                { name: 'from', label: 'From Currency', placeholder: 'USD', type: 'text' },
                { name: 'to', label: 'To Currency', placeholder: 'INR', type: 'text' },
                { name: 'amount', label: 'Amount', placeholder: '100', type: 'number' }
            ]
        }
    },
    {
        id: 'payment',
        imageName: 'bazaar-payment',
        name: 'Payment Processing',
        provider: 'Stripe Connect',
        description: 'Accept payments globally with cards, wallets, and local payment methods',
        category: 'Finance',
        testConfig: {
            method: 'POST',
            endpoint: '/pay',
            fields: [
                { name: 'amount', label: 'Amount', placeholder: '10.00', type: 'number' },
                { name: 'currency', label: 'Currency', placeholder: 'USD', type: 'text' }
            ]
        }
    },
    {
        id: 'notification',
        imageName: 'bazaar-notification',
        name: 'SMS Gateway',
        provider: 'Twilio',
        description: 'Send SMS worldwide with delivery tracking and programmable messaging',
        category: 'Communication',
        testConfig: {
            method: 'POST',
            endpoint: '/send-sms',
            fields: [
                { name: 'to', label: 'To (Phone Number)', placeholder: '+1234567890', type: 'text' },
                { name: 'message', label: 'Message', placeholder: 'Hello from Bazaar!', type: 'textarea' }
            ]
        }
    },
    {
        id: 'finance',
        imageName: 'bazaar-finance',
        name: 'Stock Market API',
        provider: 'Alpha Vantage',
        description: 'Fetch real-time stock quotes, global market data, and equity trends.',
        category: 'Finance',
        testConfig: {
            method: 'GET',
            endpoint: '/stock-price',
            fields: [
                { name: 'symbol', label: 'Stock Symbol', placeholder: 'IBM', type: 'text' }
            ]
        }
    },
    {
        id: 'tmdb',
        imageName: 'bazaar-tmdb',
        name: 'TMDB Movie Database',
        provider: 'The Movie Database',
        description: 'Access comprehensive movie and TV show metadata, ratings, and images',
        category: 'Entertainment',
        testConfig: {
            method: 'GET',
            endpoint: '/search-movie',
            fields: [
                { name: 'query', label: 'Movie Name', placeholder: 'Inception', type: 'text' },
                { name: 'year', label: 'Year (optional)', placeholder: '2010', type: 'text' }
            ]
        }
    }
];

const APIPlayground = () => {
    const navigate = useNavigate();
    const [selectedAPI, setSelectedAPI] = useState(null);
    const [httpMethod, setHttpMethod] = useState('GET');
    const [parameters, setParameters] = useState({});
    const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
    const [requestBody, setRequestBody] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [responseTime, setResponseTime] = useState(null);
    const [copied, setCopied] = useState(false);
    const [deployedURL, setDeployedURL] = useState('');

    // Initialize when API is selected
    useEffect(() => {
        if (selectedAPI) {
            setHttpMethod(selectedAPI.testConfig.method);

            // Initialize parameters with empty values
            const initialParams = {};
            selectedAPI.testConfig.fields.forEach(field => {
                initialParams[field.name] = '';
            });
            setParameters(initialParams);

            // Set default body for POST requests
            if (selectedAPI.testConfig.method === 'POST') {
                const bodyObj = {};
                selectedAPI.testConfig.fields.forEach(field => {
                    bodyObj[field.name] = '';
                });
                setRequestBody(JSON.stringify(bodyObj, null, 2));
            } else {
                setRequestBody('');
            }

            // Try to get deployed URL from localStorage
            const storedURL = localStorage.getItem(`deployed_${selectedAPI.id}`);
            if (storedURL) {
                setDeployedURL(storedURL);
            } else {
                setDeployedURL('');
            }
        }
    }, [selectedAPI]);

    const handleAPISelect = (api) => {
        setSelectedAPI(api);
        setResponse(null);
        setResponseTime(null);
    };

    const handleParameterChange = (fieldName, value) => {
        setParameters(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Update body if it's a POST request
        if (httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH') {
            try {
                const bodyObj = JSON.parse(requestBody);
                bodyObj[fieldName] = value;
                setRequestBody(JSON.stringify(bodyObj, null, 2));
            } catch (e) {
                // If body is not valid JSON, just update parameters
            }
        }
    };

    const handleAddHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const handleRemoveHeader = (index) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const handleHeaderChange = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const buildRequestURL = () => {
        if (!selectedAPI || !deployedURL) return '';

        let url = deployedURL + selectedAPI.testConfig.endpoint;

        // Handle path params for currency API
        if (selectedAPI.testConfig.usePathParams) {
            const { from, to } = parameters;
            url = `${deployedURL}/convert/${from || 'USD'}/${to || 'INR'}`;

            // Add amount as query param
            if (parameters.amount) {
                url += `?amount=${parameters.amount}`;
            }
        } else if (httpMethod === 'GET') {
            // Add query parameters for GET requests
            const queryParams = new URLSearchParams();
            Object.entries(parameters).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(key, value);
                }
            });
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        return url;
    };

    const handleSendRequest = async () => {
        if (!selectedAPI || !deployedURL) {
            alert('Please select an API and ensure it is deployed. Deploy from the main page first.');
            return;
        }

        setLoading(true);
        setResponse(null);
        const startTime = performance.now();

        try {
            const url = buildRequestURL();

            // Build headers object
            const headersObj = {};
            headers.forEach(({ key, value }) => {
                if (key && value) {
                    headersObj[key] = value;
                }
            });

            let axiosConfig = {
                method: httpMethod,
                url: url,
                headers: headersObj
            };

            // Add body for POST/PUT/PATCH requests
            if (['POST', 'PUT', 'PATCH'].includes(httpMethod)) {
                try {
                    axiosConfig.data = JSON.parse(requestBody);
                } catch (e) {
                    throw new Error('Invalid JSON in request body');
                }
            }

            const result = await axios(axiosConfig);
            const endTime = performance.now();

            setResponse({
                status: result.status,
                statusText: result.statusText,
                headers: result.headers,
                data: result.data
            });
            setResponseTime(Math.round(endTime - startTime));

        } catch (error) {
            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));

            if (error.response) {
                setResponse({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data
                });
            } else {
                setResponse({
                    status: 0,
                    statusText: 'Network Error',
                    data: { error: error.message }
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const copyResponse = () => {
        if (response) {
            navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getStatusColor = (status) => {
        if (status >= 200 && status < 300) return 'text-green-500';
        if (status >= 400 && status < 500) return 'text-yellow-500';
        if (status >= 500) return 'text-red-500';
        return 'text-gray-500';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">API Playground</h1>
                        {selectedAPI && (
                            <div className="text-sm text-gray-600">
                                {selectedAPI.name} - Endpoint: {selectedAPI.testConfig.endpoint}
                            </div>
                        )}
                    </div>
                    {selectedAPI && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-700 font-medium">Live</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Request Panel */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request</h2>

                            {/* API Selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select API Service
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedAPI?.id || ''}
                                        onChange={(e) => {
                                            const api = AVAILABLE_APIS.find(a => a.id === e.target.value);
                                            handleAPISelect(api);
                                        }}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Choose an API...</option>
                                        {AVAILABLE_APIS.map(api => (
                                            <option key={api.id} value={api.id}>
                                                {api.name} - {api.provider}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                                {selectedAPI && (
                                    <p className="mt-2 text-sm text-gray-600">{selectedAPI.description}</p>
                                )}
                            </div>

                            {selectedAPI && (
                                <>
                                    {/* Deployment URL */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deployed URL
                                        </label>
                                        <input
                                            type="text"
                                            value={deployedURL}
                                            onChange={(e) => setDeployedURL(e.target.value)}
                                            placeholder="http://192.168.49.2:30001"
                                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Deploy the API from the main page first, then paste the URL here
                                        </p>
                                    </div>

                                    {/* Method Selector */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Method
                                        </label>
                                        <div className="flex gap-2">
                                            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => (
                                                <button
                                                    key={method}
                                                    onClick={() => setHttpMethod(method)}
                                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${httpMethod === method
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* URL Display */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL
                                        </label>
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-mono break-all">
                                            {buildRequestURL() || 'Configure parameters to see URL'}
                                        </div>
                                    </div>

                                    {/* Parameters */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Parameters
                                        </label>
                                        <div className="space-y-3">
                                            {selectedAPI.testConfig.fields.map(field => (
                                                <div key={field.name}>
                                                    <label className="block text-xs text-gray-600 mb-1 font-medium">
                                                        {field.label}
                                                    </label>
                                                    {field.type === 'textarea' ? (
                                                        <textarea
                                                            value={parameters[field.name] || ''}
                                                            onChange={(e) => handleParameterChange(field.name, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            rows={3}
                                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <input
                                                            type={field.type}
                                                            value={parameters[field.name] || ''}
                                                            onChange={(e) => handleParameterChange(field.name, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Headers */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Headers
                                            </label>
                                            <button
                                                onClick={handleAddHeader}
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Header
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {headers.map((header, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={header.key}
                                                        onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                                                        placeholder="Key"
                                                        className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={header.value}
                                                        onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                                                        placeholder="Value"
                                                        className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveHeader(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Body (for POST/PUT/PATCH) */}
                                    {['POST', 'PUT', 'PATCH'].includes(httpMethod) && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Body (JSON)
                                            </label>
                                            <textarea
                                                value={requestBody}
                                                onChange={(e) => setRequestBody(e.target.value)}
                                                rows={8}
                                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder='{\n  "key": "value"\n}'
                                            />
                                        </div>
                                    )}

                                    {/* Send Button */}
                                    <button
                                        onClick={handleSendRequest}
                                        disabled={loading || !deployedURL}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Request
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Response Panel */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Response</h2>

                            {!response && !loading && (
                                <div className="text-center py-12 text-gray-400">
                                    <Send className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>Send a request to see the response</p>
                                </div>
                            )}

                            {loading && (
                                <div className="text-center py-12">
                                    <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin" />
                                    <p className="text-gray-600">Waiting for response...</p>
                                </div>
                            )}

                            {response && (
                                <>
                                    {/* Status and Time */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="text-xs text-gray-600 mb-1 font-medium">Status</div>
                                            <div className={`text-2xl font-bold ${getStatusColor(response.status)}`}>
                                                {response.status} {response.statusText}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="text-xs text-gray-600 mb-1 font-medium">Time</div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {responseTime}ms
                                            </div>
                                        </div>
                                    </div>

                                    {/* Response Body */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Response Body
                                            </label>
                                            <button
                                                onClick={copyResponse}
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="bg-slate-900 rounded-lg p-4 border border-gray-200 max-h-96 overflow-auto">
                                            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                                                {JSON.stringify(response.data, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APIPlayground;
