import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Search, Zap, Code, ArrowRight, ChevronRight, ExternalLink, Loader2, BarChart2, Bot } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import SmartAgent from './SmartAgent';

const AVAILABLE_APIS = [
    {
        id: 'email',
        imageName: 'bazaar-email',
        name: 'Email Service',
        provider: 'Resend',
        description: 'Send transactional and marketing emails with analytics and templates',
        category: 'Communication',
        popularity: '4.3M',
        rating: '4.7',
        latency: '140ms',
        price: 'Freemium',
        tags: ['email', 'resend', 'marketing'],
        testConfig: {
            method: 'POST',
            endpoint: '/send-email',
            fields: [
                { name: 'to', label: 'To', placeholder: 'recipient@example.com', type: 'email' },
                { name: 'subject', label: 'Subject', placeholder: 'Hello from Bazaar!', type: 'text' },
                { name: 'body', label: 'Body', placeholder: 'Enter your message here...', type: 'textarea' }
            ],
            dummyData: {
                to: 'demo-user@example.com',
                subject: 'Welcome to APIBazaar Simulation!',
                body: 'This is a realistic simulated email. In a real environment, this would reach your inbox in seconds.'
            },
            mockResponse: {
                status: "success",
                message: "Email dispatched successfully",
                id: "msg_2k8vP9xL1m0Z",
                provider: "Resend",
                preview_url: "https://resend.com/emails/msg_2k8vP9xL1m0Z"
            }
        }
    },
    {
        id: 'notification',
        imageName: 'bazaar-notification',
        name: 'SMS Gateway',
        provider: 'Twilio',
        description: 'Send SMS worldwide with delivery tracking and programmable messaging',
        category: 'Communication',
        popularity: '5.2M',
        rating: '4.9',
        latency: '95ms',
        price: 'Freemium',
        tags: ['sms', 'twilio', 'messaging'],
        testConfig: {
            method: 'POST',
            endpoint: '/send-sms',
            fields: [
                { name: 'to', label: 'To (Phone Number)', placeholder: '+1234567890', type: 'text' },
                { name: 'message', label: 'Message', placeholder: 'Hello from Bazaar!', type: 'textarea' }
            ],
            dummyData: {
                to: '+1 555-0199',
                message: 'APIBazaar: Your simulated verification code is 882910. Valid for 5 minutes.'
            },
            mockResponse: {
                status: "success",
                sid: "SM6f432e1a8b9c0d1e2f3g4h5i6j7k8l9",
                account_sid: "AC0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5",
                direction: "outbound-api",
                price: "0.0075",
                price_unit: "USD"
            }
        }
    },
    {
        id: 'currency',
        imageName: 'bazaar-currency',
        name: 'Live Currency API',
        provider: 'ExchangeRate API',
        description: 'Real-time Forex data and currency conversion for 170+ currencies',
        category: 'Finance',
        popularity: '1.2M',
        rating: '4.7',
        latency: '110ms',
        price: 'Freemium',
        tags: ['forex', 'currency', 'finance'],
        testConfig: {
            method: 'GET',
            endpoint: '/convert',
            usePathParams: true, // Special flag for path-based params
            fields: [
                { name: 'from', label: 'From Currency', placeholder: 'USD', type: 'text' },
                { name: 'to', label: 'To Currency', placeholder: 'INR', type: 'text' },
                { name: 'amount', label: 'Amount', placeholder: '100', type: 'number' }
            ],
            dummyData: {
                from: 'USD',
                to: 'EUR',
                amount: '250.00'
            },
            mockResponse: {
                status: "success",
                base_code: "USD",
                target_code: "EUR",
                conversion_rate: 0.92,
                conversion_result: 230.00,
                time_last_update_utc: new Date().toUTCString(),
                documentation: "https://www.exchangerate-api.com/docs"
            }
        }
    },
    {
        id: 'payment',
        imageName: 'bazaar-payment',
        name: 'Payment Processing',
        provider: 'Stripe Connect',
        description: 'Accept payments globally with cards, wallets, and local payment methods',
        category: 'Finance',
        popularity: '2.4M',
        rating: '4.8',
        latency: '120ms',
        price: 'Freemium',
        tags: ['payments', 'stripe', 'checkout'],
        testConfig: {
            method: 'POST',
            endpoint: '/pay',
            fields: [
                { name: 'amount', label: 'Amount', placeholder: '10.00', type: 'number' },
                { name: 'currency', label: 'Currency', placeholder: 'USD', type: 'text' }
            ],
            dummyData: {
                amount: '49.99',
                currency: 'USD'
            },
            mockResponse: {
                status: "success",
                id: "pi_3MtwByLkdD1Y8i5Z0Z9x2X3",
                amount: 4999,
                currency: "usd",
                payment_method_types: ["card"],
                transaction_status: "succeeded",
                created: Math.floor(Date.now() / 1000)
            }
        }
    },
    {
        id: 'gst',
        imageName: 'bazaar-gst',
        name: 'GST Verification',
        provider: 'Gov India',
        description: 'Verify GST numbers and fetch business details in real-time',
        category: 'Business',
        popularity: '890K',
        rating: '4.6',
        latency: '200ms',
        price: 'Paid',
        tags: ['tax', 'india', 'verification'],
        testConfig: {
            method: 'GET',
            endpoint: '/lookup',
            fields: [
                { name: 'gstin', label: 'GST Number', placeholder: '27AAACV9876F1Z1', type: 'text' }
            ],
            dummyData: {
                gstin: '27AAACV9876F1Z1'
            },
            mockResponse: {
                success: true,
                data: {
                    gstin: "27AAACV9876F1Z1",
                    legal_name: "Aeldosh Tech Solutions Private Limited",
                    trade_name: "Aeldosh Tech",
                    registration_date: "2024-05-12",
                    status: "Active",
                    taxpayer_type: "Regular",
                    center_jurisdiction: "WARD 1",
                    state_jurisdiction: "MAHARASHTRA"
                }
            }
        }
    },
    {
        id: 'finance',
        imageName: 'bazaar-finance',
        name: 'Stock Market API',
        provider: 'Alpha Vantage',
        description: 'Fetch real-time stock quotes, global market data, and equity trends.',
        category: 'Finance',
        popularity: '3.1M',
        rating: '4.9',
        latency: '150ms',
        price: 'Freemium',
        tags: ['stocks', 'market', 'equity'],
        testConfig: {
            method: 'GET',
            endpoint: '/stock-price',
            fields: [
                { name: 'symbol', label: 'Stock Symbol', placeholder: 'IBM', type: 'text' }
            ],
            dummyData: {
                symbol: 'AAPL'
            },
            mockResponse: {
                "Global Quote": {
                    "01. symbol": "AAPL",
                    "02. open": "193.1100",
                    "03. high": "194.4000",
                    "04. low": "191.7300",
                    "05. price": "192.4200",
                    "06. volume": "44516300",
                    "07. latest trading day": new Date().toISOString().split('T')[0],
                    "08. previous close": "193.0500",
                    "09. change": "-0.6300",
                    "10. change percent": "-0.3263%"
                }
            }
        }
    },
    // Payment APIs
    {
        id: 'razorpay',
        imageName: 'bazaar-razorpay',
        name: 'Razorpay Payment',
        provider: 'Razorpay',
        description: 'Accept payments via UPI, cards, netbanking, and wallets with instant settlements',
        category: 'Payments',
        popularity: '3.8M',
        rating: '4.8',
        latency: '105ms',
        price: 'Freemium',
        tags: ['payments', 'razorpay', 'upi', 'india'],
        testConfig: {
            method: 'POST',
            endpoint: '/create-order',
            fields: [
                { name: 'amount', label: 'Amount (INR)', placeholder: '500', type: 'number' },
                { name: 'currency', label: 'Currency', placeholder: 'INR', type: 'text' },
                { name: 'receipt', label: 'Receipt ID', placeholder: 'receipt#1', type: 'text' }
            ],
            dummyData: {
                amount: '1499',
                currency: 'INR',
                receipt: 'order_rcpt_001'
            },
            mockResponse: {
                id: "order_MNopQRst12345678",
                entity: "order",
                amount: 149900,
                amount_paid: 0,
                amount_due: 149900,
                currency: "INR",
                receipt: "order_rcpt_001",
                status: "created",
                attempts: 0,
                created_at: Math.floor(Date.now() / 1000)
            }
        }
    },
    {
        id: 'cashfree',
        imageName: 'bazaar-cashfree',
        name: 'Cashfree Payments',
        provider: 'Cashfree',
        description: 'Payment gateway with instant refunds, auto-collect, and payout solutions',
        category: 'Payments',
        popularity: '2.1M',
        rating: '4.7',
        latency: '98ms',
        price: 'Freemium',
        tags: ['payments', 'cashfree', 'gateway', 'india'],
        testConfig: {
            method: 'POST',
            endpoint: '/create-payment',
            fields: [
                { name: 'order_amount', label: 'Amount', placeholder: '299.00', type: 'number' },
                { name: 'order_currency', label: 'Currency', placeholder: 'INR', type: 'text' },
                { name: 'customer_email', label: 'Customer Email', placeholder: 'customer@example.com', type: 'email' }
            ],
            dummyData: {
                order_amount: '999.00',
                order_currency: 'INR',
                customer_email: 'customer@example.com'
            },
            mockResponse: {
                cf_order_id: "CF_ORDER_" + Date.now(),
                order_id: "order_" + Math.random().toString(36).substr(2, 9),
                entity: "order",
                order_currency: "INR",
                order_amount: 999.00,
                order_status: "ACTIVE",
                payment_session_id: "session_" + Math.random().toString(36).substr(2, 16),
                order_expiry_time: new Date(Date.now() + 3600000).toISOString()
            }
        }
    },
    {
        id: 'paytm',
        imageName: 'bazaar-paytm',
        name: 'Paytm Payment Gateway',
        provider: 'Paytm',
        description: 'Comprehensive payment solution with wallet, UPI, and card processing',
        category: 'Payments',
        popularity: '4.5M',
        rating: '4.6',
        latency: '115ms',
        price: 'Freemium',
        tags: ['payments', 'paytm', 'wallet', 'upi'],
        testConfig: {
            method: 'POST',
            endpoint: '/initiate-transaction',
            fields: [
                { name: 'order_id', label: 'Order ID', placeholder: 'ORDER_001', type: 'text' },
                { name: 'amount', label: 'Amount', placeholder: '750', type: 'number' },
                { name: 'customer_id', label: 'Customer ID', placeholder: 'CUST_001', type: 'text' }
            ],
            dummyData: {
                order_id: 'ORDER_' + Date.now(),
                amount: '2499',
                customer_id: 'CUST_12345'
            },
            mockResponse: {
                body: {
                    resultInfo: {
                        resultStatus: "S",
                        resultCode: "0000",
                        resultMsg: "Success"
                    },
                    txnToken: "TXN_TOKEN_" + Math.random().toString(36).substr(2, 32),
                    isPromoCodeValid: false,
                    authenticated: true
                },
                head: {
                    responseTimestamp: new Date().toISOString(),
                    version: "v1"
                }
            }
        }
    },
    // KYC & Verification APIs
    {
        id: 'zynflux-aadhar',
        imageName: 'bazaar-zynflux',
        name: 'Zynflux Aadhar Verification',
        provider: 'Zynflux',
        description: 'Verify Aadhar cards with OTP validation and extract demographic details',
        category: 'KYC & Verification',
        popularity: '1.5M',
        rating: '4.7',
        latency: '180ms',
        price: 'Paid',
        tags: ['kyc', 'aadhar', 'verification', 'india'],
        testConfig: {
            method: 'POST',
            endpoint: '/verify-aadhar',
            fields: [
                { name: 'aadhar_number', label: 'Aadhar Number', placeholder: '1234 5678 9012', type: 'text' },
                { name: 'consent', label: 'User Consent', placeholder: 'Y', type: 'text' }
            ],
            dummyData: {
                aadhar_number: '1234 5678 9012',
                consent: 'Y'
            },
            mockResponse: {
                success: true,
                message: "OTP sent successfully",
                transaction_id: "TXN_" + Math.random().toString(36).substr(2, 16),
                data: {
                    aadhar_number: "XXXX XXXX 9012",
                    mobile_verified: true,
                    otp_sent: true,
                    valid_till: new Date(Date.now() + 600000).toISOString()
                }
            }
        }
    },
    {
        id: 'signzy',
        imageName: 'bazaar-signzy',
        name: 'Signzy KYC Suite',
        provider: 'Signzy',
        description: 'AI-powered identity verification with PAN, Aadhar, and face matching',
        category: 'KYC & Verification',
        popularity: '980K',
        rating: '4.8',
        latency: '220ms',
        price: 'Paid',
        tags: ['kyc', 'ai', 'verification', 'pan'],
        testConfig: {
            method: 'POST',
            endpoint: '/verify-pan',
            fields: [
                { name: 'pan_number', label: 'PAN Number', placeholder: 'ABCDE1234F', type: 'text' },
                { name: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' }
            ],
            dummyData: {
                pan_number: 'ABCDE1234F',
                name: 'Rajesh Kumar'
            },
            mockResponse: {
                status: "success",
                verified: true,
                pan_number: "ABCDE1234F",
                name_on_card: "RAJESH KUMAR",
                name_match_score: 98.5,
                category: "Individual",
                status_code: "E",
                last_updated: new Date().toISOString(),
                aadhaar_seeding_status: "Y"
            }
        }
    },
    {
        id: 'idfy',
        imageName: 'bazaar-idfy',
        name: 'IDfy Verification',
        provider: 'IDfy',
        description: 'Comprehensive background verification and document authentication',
        category: 'KYC & Verification',
        popularity: '1.2M',
        rating: '4.6',
        latency: '195ms',
        price: 'Paid',
        tags: ['kyc', 'background', 'verification'],
        testConfig: {
            method: 'POST',
            endpoint: '/verify-identity',
            fields: [
                { name: 'document_type', label: 'Document Type', placeholder: 'PAN', type: 'text' },
                { name: 'document_number', label: 'Document Number', placeholder: 'ABCDE1234F', type: 'text' },
                { name: 'name', label: 'Name', placeholder: 'John Doe', type: 'text' }
            ],
            dummyData: {
                document_type: 'PAN',
                document_number: 'ABCDE1234F',
                name: 'Priya Sharma'
            },
            mockResponse: {
                request_id: "REQ_" + Math.random().toString(36).substr(2, 12),
                status: "completed",
                verification_status: "verified",
                document_type: "PAN",
                document_number: "ABCDE1234F",
                name_matched: true,
                confidence_score: 96.8,
                extracted_data: {
                    full_name: "PRIYA SHARMA",
                    father_name: "RAMESH SHARMA",
                    dob: "15/08/1990"
                },
                timestamp: new Date().toISOString()
            }
        }
    },
    // Bank Account APIs
    {
        id: 'penny-drop',
        imageName: 'bazaar-pennydrop',
        name: 'Penny Drop Verification',
        provider: 'BankAPI',
        description: 'Verify bank account details by transferring ₹1 and validating account holder name',
        category: 'Banking',
        popularity: '850K',
        rating: '4.5',
        latency: '2500ms',
        price: 'Paid',
        tags: ['banking', 'verification', 'pennydrop'],
        testConfig: {
            method: 'POST',
            endpoint: '/penny-drop',
            fields: [
                { name: 'account_number', label: 'Account Number', placeholder: '1234567890', type: 'text' },
                { name: 'ifsc_code', label: 'IFSC Code', placeholder: 'SBIN0001234', type: 'text' },
                { name: 'beneficiary_name', label: 'Beneficiary Name', placeholder: 'John Doe', type: 'text' }
            ],
            dummyData: {
                account_number: '9876543210',
                ifsc_code: 'HDFC0001234',
                beneficiary_name: 'Amit Patel'
            },
            mockResponse: {
                status: "success",
                verified: true,
                account_number: "XXXXXX3210",
                ifsc_code: "HDFC0001234",
                bank_name: "HDFC Bank",
                branch: "Mumbai Main Branch",
                account_holder_name: "AMIT PATEL",
                name_match_percentage: 100,
                account_exists: true,
                utr_number: "UTR" + Date.now(),
                transaction_timestamp: new Date().toISOString()
            }
        }
    },
    {
        id: 'bank-verification',
        imageName: 'bazaar-bankverify',
        name: 'Bank Account Verification',
        provider: 'FinAPI',
        description: 'Instant bank account validation without penny drop using bank APIs',
        category: 'Banking',
        popularity: '1.1M',
        rating: '4.7',
        latency: '450ms',
        price: 'Paid',
        tags: ['banking', 'verification', 'instant'],
        testConfig: {
            method: 'POST',
            endpoint: '/verify-account',
            fields: [
                { name: 'account_number', label: 'Account Number', placeholder: '1234567890', type: 'text' },
                { name: 'ifsc_code', label: 'IFSC Code', placeholder: 'SBIN0001234', type: 'text' }
            ],
            dummyData: {
                account_number: '1122334455',
                ifsc_code: 'ICIC0001234'
            },
            mockResponse: {
                status: "verified",
                account_number: "XXXXXX4455",
                ifsc_code: "ICIC0001234",
                bank_details: {
                    bank_name: "ICICI Bank",
                    branch_name: "Delhi Connaught Place",
                    micr_code: "110229002",
                    branch_address: "Connaught Place, New Delhi - 110001"
                },
                account_status: "active",
                account_type: "Savings",
                name_at_bank: "SNEHA REDDY",
                verified_at: new Date().toISOString()
            }
        }
    },
    {
        id: 'account-aggregator',
        imageName: 'bazaar-aa',
        name: 'Account Aggregator API',
        provider: 'Sahamati',
        description: 'Fetch consolidated financial data from multiple banks with user consent',
        category: 'Banking',
        popularity: '650K',
        rating: '4.4',
        latency: '1800ms',
        price: 'Paid',
        tags: ['banking', 'aggregator', 'financial-data'],
        testConfig: {
            method: 'POST',
            endpoint: '/fetch-data',
            fields: [
                { name: 'customer_id', label: 'Customer ID', placeholder: 'CUST_001', type: 'text' },
                { name: 'consent_id', label: 'Consent ID', placeholder: 'CONSENT_123', type: 'text' },
                { name: 'data_range', label: 'Data Range (months)', placeholder: '6', type: 'number' }
            ],
            dummyData: {
                customer_id: 'CUST_98765',
                consent_id: 'CONSENT_AA_001',
                data_range: '12'
            },
            mockResponse: {
                status: "success",
                consent_id: "CONSENT_AA_001",
                customer_id: "CUST_98765",
                data_session_id: "SESSION_" + Math.random().toString(36).substr(2, 16),
                accounts: [
                    {
                        fip_id: "HDFC-FIP",
                        account_type: "savings",
                        masked_account_number: "XXXXXX7890",
                        current_balance: 125000.50,
                        currency: "INR"
                    },
                    {
                        fip_id: "ICICI-FIP",
                        account_type: "current",
                        masked_account_number: "XXXXXX4321",
                        current_balance: 450000.00,
                        currency: "INR"
                    }
                ],
                total_balance: 575000.50,
                data_fetched_at: new Date().toISOString()
            }
        }
    },
    // Document Verification APIs
    {
        id: 'digilocker',
        imageName: 'bazaar-digilocker',
        name: 'DigiLocker Integration',
        provider: 'Gov India',
        description: 'Access government-issued documents securely from DigiLocker',
        category: 'Document Verification',
        popularity: '2.3M',
        rating: '4.5',
        latency: '850ms',
        price: 'Free',
        tags: ['documents', 'government', 'digilocker'],
        testConfig: {
            method: 'POST',
            endpoint: '/fetch-document',
            fields: [
                { name: 'document_type', label: 'Document Type', placeholder: 'ADHAR', type: 'text' },
                { name: 'aadhar_number', label: 'Aadhar Number', placeholder: '1234 5678 9012', type: 'text' },
                { name: 'consent_token', label: 'Consent Token', placeholder: 'TOKEN_123', type: 'text' }
            ],
            dummyData: {
                document_type: 'ADHAR',
                aadhar_number: '1234 5678 9012',
                consent_token: 'CONSENT_DL_001'
            },
            mockResponse: {
                status: "success",
                document_type: "AADHAAR",
                uri: "https://digilocker.gov.in/doc/ADHAR-" + Math.random().toString(36).substr(2, 12),
                name: "VIKRAM SINGH",
                dob: "12/03/1988",
                gender: "M",
                address: "123, MG Road, Bangalore, Karnataka - 560001",
                photo_available: true,
                document_id: "DOC_" + Date.now(),
                issued_on: "2020-05-15",
                downloaded_at: new Date().toISOString()
            }
        }
    },
    {
        id: 'voter-id',
        imageName: 'bazaar-voterid',
        name: 'Voter ID Verification',
        provider: 'Election Commission',
        description: 'Verify voter ID cards and extract voter information',
        category: 'Document Verification',
        popularity: '720K',
        rating: '4.3',
        latency: '650ms',
        price: 'Paid',
        tags: ['documents', 'voter-id', 'verification'],
        testConfig: {
            method: 'POST',
            endpoint: '/verify-voter',
            fields: [
                { name: 'epic_number', label: 'EPIC Number', placeholder: 'ABC1234567', type: 'text' },
                { name: 'state', label: 'State', placeholder: 'Karnataka', type: 'text' }
            ],
            dummyData: {
                epic_number: 'KAR1234567',
                state: 'Karnataka'
            },
            mockResponse: {
                status: "verified",
                epic_number: "KAR1234567",
                name: "MEERA KRISHNAN",
                father_name: "KRISHNAN NAIR",
                gender: "Female",
                age: 34,
                state: "Karnataka",
                assembly_constituency: "Bangalore South",
                parliamentary_constituency: "Bangalore South",
                part_number: "123",
                serial_number: "456",
                polling_station: "Government School, Jayanagar",
                verified_at: new Date().toISOString()
            }
        }
    },
    {
        id: 'udyam',
        imageName: 'bazaar-udyam',
        name: 'Udyam Certificate Verification',
        provider: 'MSME India',
        description: 'Verify Udyam registration certificates for MSMEs',
        category: 'Document Verification',
        popularity: '450K',
        rating: '4.4',
        latency: '580ms',
        price: 'Paid',
        tags: ['documents', 'msme', 'udyam', 'business'],
        testConfig: {
            method: 'GET',
            endpoint: '/verify-udyam',
            fields: [
                { name: 'udyam_number', label: 'Udyam Number', placeholder: 'UDYAM-XX-00-0000000', type: 'text' }
            ],
            dummyData: {
                udyam_number: 'UDYAM-KA-12-0012345'
            },
            mockResponse: {
                status: "active",
                udyam_number: "UDYAM-KA-12-0012345",
                enterprise_name: "Tech Innovations Pvt Ltd",
                enterprise_type: "Manufacturing",
                organization_type: "Private Limited Company",
                major_activity: "Software Development",
                social_category: "General",
                date_of_incorporation: "2018-06-15",
                date_of_udyam_registration: "2020-07-01",
                pan: "AABCT1234F",
                state: "Karnataka",
                district: "Bangalore Urban",
                address: "Electronic City, Bangalore - 560100",
                mobile: "+91-9876543210",
                email: "info@techinnovations.com",
                verified_at: new Date().toISOString()
            }
        }
    },
    // Metadata APIs
    {
        id: 'tmdb',
        imageName: 'bazaar-tmdb',
        name: 'TMDB Movie Database',
        provider: 'The Movie Database',
        description: 'Access comprehensive movie and TV show metadata, ratings, and images',
        category: 'Entertainment',
        popularity: '5.8M',
        rating: '4.9',
        latency: '180ms',
        price: 'Freemium',
        tags: ['movies', 'metadata', 'entertainment'],
        testConfig: {
            method: 'GET',
            endpoint: '/search-movie',
            fields: [
                { name: 'query', label: 'Movie Name', placeholder: 'Inception', type: 'text' },
                { name: 'year', label: 'Year (optional)', placeholder: '2010', type: 'text' }
            ],
            dummyData: {
                query: 'The Matrix',
                year: '1999'
            },
            mockResponse: {
                page: 1,
                results: [
                    {
                        id: 603,
                        title: "The Matrix",
                        original_title: "The Matrix",
                        overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
                        release_date: "1999-03-31",
                        popularity: 89.456,
                        vote_average: 8.7,
                        vote_count: 24567,
                        adult: false,
                        backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
                        poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                        genre_ids: [28, 878],
                        original_language: "en",
                        video: false
                    }
                ],
                total_pages: 1,
                total_results: 1
            }
        }
    },
    {
        id: 'tvmaze',
        imageName: 'bazaar-tvmaze',
        name: 'TV Maze API',
        provider: 'TV Maze',
        description: 'TV show schedules, episode information, and comprehensive series metadata',
        category: 'Entertainment',
        popularity: '1.9M',
        rating: '4.6',
        latency: '145ms',
        price: 'Free',
        tags: ['tv-shows', 'metadata', 'entertainment'],
        testConfig: {
            method: 'GET',
            endpoint: '/search-show',
            fields: [
                { name: 'query', label: 'Show Name', placeholder: 'Breaking Bad', type: 'text' }
            ],
            dummyData: {
                query: 'Friends'
            },
            mockResponse: {
                score: 0.98765,
                show: {
                    id: 431,
                    url: "https://www.tvmaze.com/shows/431/friends",
                    name: "Friends",
                    type: "Scripted",
                    language: "English",
                    genres: ["Comedy", "Romance"],
                    status: "Ended",
                    runtime: 30,
                    averageRuntime: 30,
                    premiered: "1994-09-22",
                    ended: "2004-05-06",
                    rating: { average: 8.9 },
                    network: {
                        id: 1,
                        name: "NBC",
                        country: { name: "United States", code: "US" }
                    },
                    summary: "Six young people navigate life and love in Manhattan.",
                    updated: Math.floor(Date.now() / 1000)
                }
            }
        }
    }
];

const CATEGORIES = ['All', 'Finance', 'Communication', 'Business', 'Payments', 'KYC & Verification', 'Banking', 'Document Verification', 'Entertainment'];

export default function APIBazaar() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('catalog');
    const [selectedAPIs, setSelectedAPIs] = useState([]);
    const [deployedAPIs, setDeployedAPIs] = useState([]);
    const [deploymentProgress, setDeploymentProgress] = useState({});
    const [copiedEndpoint, setCopiedEndpoint] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [testModalAPI, setTestModalAPI] = useState(null);
    const [testFormData, setTestFormData] = useState({});
    const [testLoading, setTestLoading] = useState(false);
    const [testResponse, setTestResponse] = useState(null);
    const [customAPIKeys, setCustomAPIKeys] = useState({});
    const [showKeyInput, setShowKeyInput] = useState({});
    const [showAssistant, setShowAssistant] = useState(false);

    const handleAIStackSelection = (apiIds) => {
        setSelectedAPIs(apiIds);
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    };
    const userEmail = localStorage.getItem('userEmail') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    const filteredAPIs = AVAILABLE_APIS.filter(api => {
        const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            api.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || api.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleAPI = (apiId) => {
        setSelectedAPIs(prev =>
            prev.includes(apiId)
                ? prev.filter(id => id !== apiId)
                : [...prev, apiId]
        );
    };

    const startDeployment = async () => {
        setCurrentPage('deploying');
        const apisToDeploy = selectedAPIs.map(id => AVAILABLE_APIS.find(api => api.id === id));

        const initialProgress = {};
        apisToDeploy.forEach(api => {
            initialProgress[api.id] = { status: 'initializing', message: 'Setting up...' };
        });
        setDeploymentProgress(initialProgress);

        const newDeployedAPIs = [...deployedAPIs];

        for (const api of apisToDeploy) {
            try {
                setDeploymentProgress(prev => ({
                    ...prev,
                    [api.id]: { status: 'deploying', message: 'Applying Kubernetes manifests...' }
                }));

                const response = await axios.post('http://localhost:5000/deploy', {
                    api_name: api.id,
                    image_name: api.imageName,
                    custom_api_key: customAPIKeys[api.id] || undefined
                });

                if (response.data.status === 'success') {
                    setDeploymentProgress(prev => ({
                        ...prev,
                        [api.id]: { status: 'live', message: 'Live', url: response.data.url }
                    }));

                    // Check if already in deployed list, update or add
                    const index = newDeployedAPIs.findIndex(d => d.id === api.id);
                    const deploymentInfo = { ...api, url: response.data.url };
                    if (index !== -1) {
                        newDeployedAPIs[index] = deploymentInfo;
                    } else {
                        newDeployedAPIs.push(deploymentInfo);
                    }
                } else {
                    throw new Error(response.data.message);
                }
            } catch (err) {
                setDeploymentProgress(prev => ({
                    ...prev,
                    [api.id]: { status: 'error', message: err.message }
                }));
            }
        }

        setDeployedAPIs(newDeployedAPIs);

        // Check if at least one was successful
        const hasSuccess = Object.values(initialProgress).some(p => p.status === 'live');

        setTimeout(() => {
            if (hasSuccess) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            setCurrentPage('dashboard');
            setSelectedAPIs([]);
        }, 2000);
    };

    const copyEndpoint = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedEndpoint(url);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    const handleTestAPI = (api) => {
        setTestModalAPI(api);
        setTestFormData(api.testConfig?.dummyData || {});
        setTestResponse(null);
    };

    const runAPITest = async () => {
        setTestLoading(true);
        setTestResponse(null);
        try {
            const config = testModalAPI.testConfig;
            // Get base URL by removing the test endpoint if it exists at the end
            let baseUrl = testModalAPI.url;

            // Special handling for currency API - remove any existing path parameters
            if (config.usePathParams && testModalAPI.id === 'currency') {
                // Extract base URL up to /convert (remove any path params like /USD/INR)
                const convertIndex = baseUrl.indexOf('/convert');
                if (convertIndex !== -1) {
                    baseUrl = baseUrl.substring(0, convertIndex);
                }
            } else if (testModalAPI.url.endsWith(config.endpoint)) {
                baseUrl = testModalAPI.url.substring(0, testModalAPI.url.length - config.endpoint.length);
            }

            // Ensure no double slashes or missing slashes
            if (baseUrl.endsWith('/') && config.endpoint.startsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            let url = `${baseUrl}${config.endpoint}`;

            // Handle path parameters for currency API
            if (config.usePathParams && testModalAPI.id === 'currency') {
                const from = testFormData.from || config.dummyData.from;
                const to = testFormData.to || config.dummyData.to;
                const amount = testFormData.amount || config.dummyData.amount;
                url = `${baseUrl}/convert/${from}/${to}?amount=${amount}`;
            }

            let response;
            if (config.method === 'POST') {
                response = await axios.post(url, testFormData);
            } else {
                // For GET requests with path params, don't send params again
                if (config.usePathParams) {
                    response = await axios.get(url);
                } else {
                    response = await axios.get(url, { params: testFormData });
                }
            }

            setTestResponse({
                status: 'success',
                data: response.data,
                curl: `curl -X ${config.method} ${url} \\\n-H "Content-Type: application/json" ${config.method === 'POST' ? `\\\n-d '${JSON.stringify(testFormData, null, 2)}'` : ''}`
            });
        } catch (err) {
            setTestResponse({
                status: 'error',
                message: err.response?.data?.message || err.message,
                data: err.response?.data
            });
        } finally {
            setTestLoading(false);
        }
    };

    const simulateAPITest = async () => {
        setTestLoading(true);
        setTestResponse(null);

        // Simulate realistic network delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

        try {
            const config = testModalAPI.testConfig;
            let baseUrl = testModalAPI.url;
            if (testModalAPI.url.endsWith(config.endpoint)) {
                baseUrl = testModalAPI.url.substring(0, testModalAPI.url.length - config.endpoint.length);
            }
            if (baseUrl.endsWith('/') && config.endpoint.startsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            const url = `${baseUrl}${config.endpoint}`;

            // Generate dynamic mock response based on API type
            let mockData = { ...config.mockResponse };

            // Add timestamp and request tracking
            const timestamp = new Date().toISOString();
            const requestId = `req_${Math.random().toString(36).substr(2, 9)}`;

            // Enhance mock response with realistic metadata
            if (testModalAPI.id === 'email') {
                mockData = {
                    ...mockData,
                    id: `msg_${Math.random().toString(36).substr(2, 12)}`,
                    timestamp: timestamp,
                    request_id: requestId,
                    to: testFormData.to || config.dummyData.to,
                    subject: testFormData.subject || config.dummyData.subject,
                    sent_at: timestamp,
                    delivery_status: "queued",
                    estimated_delivery: new Date(Date.now() + 2000).toISOString()
                };
            } else if (testModalAPI.id === 'notification') {
                mockData = {
                    ...mockData,
                    sid: `SM${Math.random().toString(36).substr(2, 32)}`,
                    to: testFormData.to || config.dummyData.to,
                    body: testFormData.message || config.dummyData.message,
                    date_created: timestamp,
                    date_sent: timestamp,
                    status: "sent"
                };
            } else if (testModalAPI.id === 'currency') {
                const rate = 0.85 + Math.random() * 0.2;
                const amount = parseFloat(testFormData.amount || config.dummyData.amount);
                mockData = {
                    ...mockData,
                    base_code: testFormData.from || config.dummyData.from,
                    target_code: testFormData.to || config.dummyData.to,
                    conversion_rate: rate.toFixed(4),
                    conversion_result: (amount * rate).toFixed(2),
                    time_last_update_utc: timestamp
                };
            } else if (testModalAPI.id === 'payment') {
                const amount = parseFloat(testFormData.amount || config.dummyData.amount);
                mockData = {
                    ...mockData,
                    id: `pi_${Math.random().toString(36).substr(2, 24)}`,
                    amount: Math.round(amount * 100),
                    currency: (testFormData.currency || config.dummyData.currency).toLowerCase(),
                    created: Math.floor(Date.now() / 1000),
                    receipt_url: `https://pay.stripe.com/receipts/${Math.random().toString(36).substr(2, 16)}`
                };
            } else if (testModalAPI.id === 'finance') {
                const basePrice = 150 + Math.random() * 100;
                const change = (Math.random() - 0.5) * 10;
                mockData = {
                    "Global Quote": {
                        "01. symbol": testFormData.symbol || config.dummyData.symbol,
                        "02. open": basePrice.toFixed(4),
                        "03. high": (basePrice + Math.abs(change)).toFixed(4),
                        "04. low": (basePrice - Math.abs(change)).toFixed(4),
                        "05. price": (basePrice + change).toFixed(4),
                        "06. volume": Math.floor(30000000 + Math.random() * 20000000).toString(),
                        "07. latest trading day": new Date().toISOString().split('T')[0],
                        "08. previous close": basePrice.toFixed(4),
                        "09. change": change.toFixed(4),
                        "10. change percent": ((change / basePrice) * 100).toFixed(4) + "%"
                    }
                };
            } else if (testModalAPI.id === 'gst') {
                mockData = {
                    ...mockData,
                    data: {
                        ...mockData.data,
                        gstin: testFormData.gstin || config.dummyData.gstin,
                        last_updated: timestamp
                    }
                };
            } else if (testModalAPI.id === 'razorpay') {
                const amount = parseFloat(testFormData.amount || config.dummyData.amount);
                mockData = {
                    ...mockData,
                    id: `order_${Math.random().toString(36).substr(2, 16)}`,
                    amount: Math.round(amount * 100),
                    amount_due: Math.round(amount * 100),
                    currency: testFormData.currency || config.dummyData.currency,
                    receipt: testFormData.receipt || config.dummyData.receipt,
                    created_at: Math.floor(Date.now() / 1000)
                };
            } else if (testModalAPI.id === 'cashfree') {
                mockData = {
                    ...mockData,
                    cf_order_id: `CF_ORDER_${Date.now()}`,
                    order_id: `order_${Math.random().toString(36).substr(2, 9)}`,
                    order_amount: parseFloat(testFormData.order_amount || config.dummyData.order_amount),
                    order_currency: testFormData.order_currency || config.dummyData.order_currency,
                    payment_session_id: `session_${Math.random().toString(36).substr(2, 16)}`,
                    order_expiry_time: new Date(Date.now() + 3600000).toISOString()
                };
            } else if (testModalAPI.id === 'paytm') {
                mockData = {
                    body: {
                        ...mockData.body,
                        txnToken: `TXN_TOKEN_${Math.random().toString(36).substr(2, 32)}`
                    },
                    head: {
                        responseTimestamp: timestamp,
                        version: "v1"
                    }
                };
            } else if (testModalAPI.id === 'zynflux-aadhar') {
                mockData = {
                    ...mockData,
                    transaction_id: `TXN_${Math.random().toString(36).substr(2, 16)}`,
                    data: {
                        aadhar_number: (testFormData.aadhar_number || config.dummyData.aadhar_number).replace(/\d(?=\d{4})/g, 'X'),
                        mobile_verified: true,
                        otp_sent: true,
                        valid_till: new Date(Date.now() + 600000).toISOString()
                    }
                };
            } else if (testModalAPI.id === 'signzy') {
                mockData = {
                    ...mockData,
                    pan_number: testFormData.pan_number || config.dummyData.pan_number,
                    name_on_card: (testFormData.name || config.dummyData.name).toUpperCase(),
                    name_match_score: 95 + Math.random() * 5,
                    last_updated: timestamp
                };
            } else if (testModalAPI.id === 'idfy') {
                mockData = {
                    ...mockData,
                    request_id: `REQ_${Math.random().toString(36).substr(2, 12)}`,
                    document_type: testFormData.document_type || config.dummyData.document_type,
                    document_number: testFormData.document_number || config.dummyData.document_number,
                    confidence_score: 94 + Math.random() * 6,
                    extracted_data: {
                        ...mockData.extracted_data,
                        full_name: (testFormData.name || config.dummyData.name).toUpperCase()
                    },
                    timestamp: timestamp
                };
            } else if (testModalAPI.id === 'penny-drop') {
                const accNum = testFormData.account_number || config.dummyData.account_number;
                mockData = {
                    ...mockData,
                    account_number: 'XXXXXX' + accNum.slice(-4),
                    ifsc_code: testFormData.ifsc_code || config.dummyData.ifsc_code,
                    account_holder_name: (testFormData.beneficiary_name || config.dummyData.beneficiary_name).toUpperCase(),
                    utr_number: `UTR${Date.now()}`,
                    transaction_timestamp: timestamp
                };
            } else if (testModalAPI.id === 'bank-verification') {
                const accNum = testFormData.account_number || config.dummyData.account_number;
                mockData = {
                    ...mockData,
                    account_number: 'XXXXXX' + accNum.slice(-4),
                    ifsc_code: testFormData.ifsc_code || config.dummyData.ifsc_code,
                    verified_at: timestamp
                };
            } else if (testModalAPI.id === 'account-aggregator') {
                const randomBalance1 = 50000 + Math.random() * 200000;
                const randomBalance2 = 100000 + Math.random() * 500000;
                mockData = {
                    ...mockData,
                    consent_id: testFormData.consent_id || config.dummyData.consent_id,
                    customer_id: testFormData.customer_id || config.dummyData.customer_id,
                    data_session_id: `SESSION_${Math.random().toString(36).substr(2, 16)}`,
                    accounts: [
                        { ...mockData.accounts[0], current_balance: parseFloat(randomBalance1.toFixed(2)) },
                        { ...mockData.accounts[1], current_balance: parseFloat(randomBalance2.toFixed(2)) }
                    ],
                    total_balance: parseFloat((randomBalance1 + randomBalance2).toFixed(2)),
                    data_fetched_at: timestamp
                };
            } else if (testModalAPI.id === 'digilocker') {
                mockData = {
                    ...mockData,
                    uri: `https://digilocker.gov.in/doc/ADHAR-${Math.random().toString(36).substr(2, 12)}`,
                    document_id: `DOC_${Date.now()}`,
                    downloaded_at: timestamp
                };
            } else if (testModalAPI.id === 'voter-id') {
                mockData = {
                    ...mockData,
                    epic_number: testFormData.epic_number || config.dummyData.epic_number,
                    state: testFormData.state || config.dummyData.state,
                    verified_at: timestamp
                };
            } else if (testModalAPI.id === 'udyam') {
                mockData = {
                    ...mockData,
                    udyam_number: testFormData.udyam_number || config.dummyData.udyam_number,
                    verified_at: timestamp
                };
            } else if (testModalAPI.id === 'tmdb') {
                mockData = {
                    ...mockData,
                    results: [
                        {
                            ...mockData.results[0],
                            title: testFormData.query || config.dummyData.query,
                            original_title: testFormData.query || config.dummyData.query,
                            release_date: testFormData.year ? `${testFormData.year}-01-01` : mockData.results[0].release_date,
                            vote_average: (7 + Math.random() * 3).toFixed(1),
                            vote_count: Math.floor(10000 + Math.random() * 50000),
                            popularity: (50 + Math.random() * 100).toFixed(3)
                        }
                    ]
                };
            } else if (testModalAPI.id === 'tvmaze') {
                mockData = {
                    ...mockData,
                    show: {
                        ...mockData.show,
                        name: testFormData.query || config.dummyData.query,
                        rating: { average: (7 + Math.random() * 3).toFixed(1) },
                        updated: Math.floor(Date.now() / 1000)
                    }
                };
            }

            setTestResponse({
                status: 'success',
                data: mockData,
                curl: `curl -X ${config.method} ${url} \\\n-H "Content-Type: application/json" ${config.method === 'POST' ? `\\\n-d '${JSON.stringify(testFormData, null, 2)}'` : `\\\n${Object.entries(testFormData).map(([k, v]) => `-d "${k}=${v}"`).join(' \\\n')}`}`
            });
        } catch (err) {
            setTestResponse({
                status: 'error',
                message: 'Preview generation failed',
                data: { error: err.message }
            });
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900">APIBazaar</h1>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cloud Infrastructure Orchestrator</p>
                            </div>
                        </div>
                        <nav className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAssistant(true)}
                                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 mr-2"
                            >
                                <Bot className="w-4 h-4" />
                                AI Architect
                            </button>
                            <button
                                onClick={() => setCurrentPage('catalog')}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentPage === 'catalog'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                Browse APIs
                            </button>
                            <button
                                onClick={() => navigate('/playground')}
                                className="px-4 py-2 text-sm font-semibold rounded-lg transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            >
                                🧪 Playground
                            </button>
                            <button
                                onClick={() => navigate('/analytics')}
                                className="px-4 py-2 text-sm font-semibold rounded-lg transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2"
                            >
                                <BarChart2 className="w-4 h-4" />
                                Analytics
                            </button>
                            {deployedAPIs.length > 0 && (
                                <button
                                    onClick={() => setCurrentPage('dashboard')}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentPage === 'dashboard'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    My Stack
                                </button>
                            )}
                            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
                            <div className="flex items-center gap-3 ml-2">
                                <div className="text-right hidden sm:block">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</div>
                                    <div className="text-xs font-bold text-slate-700">{userEmail}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                >
                                    Logout
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* API Catalog */}
                {currentPage === 'catalog' && (
                    <div className="space-y-10">
                        {/* Search & Filters */}
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search APIs by name, category, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                />
                            </div>

                            <div className="relative">
                                <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === cat
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* API Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAPIs.map(api => {
                                const isSelected = selectedAPIs.includes(api.id);
                                return (
                                    <div
                                        key={api.id}
                                        onClick={() => toggleAPI(api.id)}
                                        className={`relative bg-white rounded-2xl border cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${isSelected
                                            ? 'border-blue-500 ring-4 ring-blue-500/5'
                                            : 'border-slate-200 hover:border-slate-300 shadow-sm'
                                            }`}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-xl font-bold text-slate-900">{api.name}</h3>
                                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-tight">{api.provider}</p>
                                                    </div>
                                                    <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold uppercase tracking-wider border border-blue-100">
                                                        {api.price}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                                                        ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/20'
                                                        : 'border-slate-200 group-hover:border-blue-500'
                                                        }`}
                                                >
                                                    {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-2">
                                                {api.description}
                                            </p>

                                            <div className="flex items-center gap-6 text-xs text-slate-500 mb-6 border-t border-slate-50 pt-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="font-bold text-slate-700">{api.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Zap className="w-3 h-3 text-blue-500" />
                                                    <span className="font-bold text-slate-700">{api.latency}</span>
                                                </div>
                                                <div className="font-medium">
                                                    <span className="font-bold text-slate-700">{api.popularity}</span> calls
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {api.tags.map(tag => (
                                                    <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-tighter border border-slate-100">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Custom API Key Input for Currency API */}
                                        {api.id === 'currency' && (
                                            <div className="border-t border-slate-100 px-6 pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setShowKeyInput(prev => ({ ...prev, [api.id]: !prev[api.id] }))}
                                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-3"
                                                >
                                                    <Code className="w-3.5 h-3.5" />
                                                    {showKeyInput[api.id] ? 'Hide' : 'Add Your Own API Key'}
                                                    <ChevronRight className={`w-3 h-3 transition-transform ${showKeyInput[api.id] ? 'rotate-90' : ''}`} />
                                                </button>
                                                {showKeyInput[api.id] && (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your ExchangeRate API key"
                                                            value={customAPIKeys[api.id] || ''}
                                                            onChange={(e) => setCustomAPIKeys(prev => ({ ...prev, [api.id]: e.target.value }))}
                                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        />
                                                        <p className="text-[10px] text-slate-500">
                                                            Get your free key at <a href="https://www.exchangerate-api.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">exchangerate-api.com</a>
                                                        </p>
                                                        {customAPIKeys[api.id] && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                                                                <Check className="w-3 h-3" />
                                                                Custom key will be used
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Custom API Key Input for Email API */}
                                        {api.id === 'email' && (
                                            <div className="border-t border-slate-100 px-6 pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setShowKeyInput(prev => ({ ...prev, [api.id]: !prev[api.id] }))}
                                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-3"
                                                >
                                                    <Code className="w-3.5 h-3.5" />
                                                    {showKeyInput[api.id] ? 'Hide' : 'Add Your Own API Key'}
                                                    <ChevronRight className={`w-3 h-3 transition-transform ${showKeyInput[api.id] ? 'rotate-90' : ''}`} />
                                                </button>
                                                {showKeyInput[api.id] && (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your Resend API key"
                                                            value={customAPIKeys[api.id] || ''}
                                                            onChange={(e) => setCustomAPIKeys(prev => ({ ...prev, [api.id]: e.target.value }))}
                                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        />
                                                        <p className="text-[10px] text-slate-500">
                                                            Get your free key at <a href="https://resend.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com</a>
                                                        </p>
                                                        {customAPIKeys[api.id] && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                                                                <Check className="w-3 h-3" />
                                                                Custom key will be used
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Custom API Key Input for Finance API */}
                                        {api.id === 'finance' && (
                                            <div className="border-t border-slate-100 px-6 pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setShowKeyInput(prev => ({ ...prev, [api.id]: !prev[api.id] }))}
                                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-3"
                                                >
                                                    <Code className="w-3.5 h-3.5" />
                                                    {showKeyInput[api.id] ? 'Hide' : 'Add Your Own API Key'}
                                                    <ChevronRight className={`w-3 h-3 transition-transform ${showKeyInput[api.id] ? 'rotate-90' : ''}`} />
                                                </button>
                                                {showKeyInput[api.id] && (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your Alpha Vantage API key"
                                                            value={customAPIKeys[api.id] || ''}
                                                            onChange={(e) => setCustomAPIKeys(prev => ({ ...prev, [api.id]: e.target.value }))}
                                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        />
                                                        <p className="text-[10px] text-slate-500">
                                                            Get your free key at <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">alphavantage.co</a>
                                                        </p>
                                                        {customAPIKeys[api.id] && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                                                                <Check className="w-3 h-3" />
                                                                Custom key will be used
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Custom API Key Input for Notification API */}
                                        {api.id === 'notification' && (
                                            <div className="border-t border-slate-100 px-6 pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setShowKeyInput(prev => ({ ...prev, [api.id]: !prev[api.id] }))}
                                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-3"
                                                >
                                                    <Code className="w-3.5 h-3.5" />
                                                    {showKeyInput[api.id] ? 'Hide' : 'Add Your Own Twilio Credentials'}
                                                    <ChevronRight className={`w-3 h-3 transition-transform ${showKeyInput[api.id] ? 'rotate-90' : ''}`} />
                                                </button>
                                                {showKeyInput[api.id] && (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="SID:TOKEN:PHONE (e.g., ACxxx:abc123:+1234567890)"
                                                            value={customAPIKeys[api.id] || ''}
                                                            onChange={(e) => setCustomAPIKeys(prev => ({ ...prev, [api.id]: e.target.value }))}
                                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                                        />
                                                        <p className="text-[10px] text-slate-500">
                                                            Format: SID:TOKEN:PHONE separated by colons. Get credentials at <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">twilio.com</a>
                                                        </p>
                                                        {customAPIKeys[api.id] && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                                                                <Check className="w-3 h-3" />
                                                                Custom credentials will be used
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Custom API Key Input for Movie API */}
                                        {api.id === 'tmdb' && (
                                            <div className="border-t border-slate-100 px-6 pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setShowKeyInput(prev => ({ ...prev, [api.id]: !prev[api.id] }))}
                                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-3"
                                                >
                                                    <Code className="w-3.5 h-3.5" />
                                                    {showKeyInput[api.id] ? 'Hide' : 'Add Your Own API Key'}
                                                    <ChevronRight className={`w-3 h-3 transition-transform ${showKeyInput[api.id] ? 'rotate-90' : ''}`} />
                                                </button>
                                                {showKeyInput[api.id] && (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your TMDB API Bearer Token"
                                                            value={customAPIKeys[api.id] || ''}
                                                            onChange={(e) => setCustomAPIKeys(prev => ({ ...prev, [api.id]: e.target.value }))}
                                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                                        />
                                                        <p className="text-[10px] text-slate-500">
                                                            Get your API key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">themoviedb.org</a>
                                                        </p>
                                                        {customAPIKeys[api.id] && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                                                                <Check className="w-3 h-3" />
                                                                Custom key will be used
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Generic Custom API Key Input for Other APIs */}
                                        {!['currency', 'email', 'finance', 'notification', 'tmdb', 'gst', 'payment'].includes(api.id) && (
                                            <div className="border-t border-slate-100 px-6 pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setShowKeyInput(prev => ({ ...prev, [api.id]: !prev[api.id] }))}
                                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-3"
                                                >
                                                    <Code className="w-3.5 h-3.5" />
                                                    {showKeyInput[api.id] ? 'Hide' : 'Add Your Own API Key'}
                                                    <ChevronRight className={`w-3 h-3 transition-transform ${showKeyInput[api.id] ? 'rotate-90' : ''}`} />
                                                </button>
                                                {showKeyInput[api.id] && (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder={`Enter your ${api.provider} API key`}
                                                            value={customAPIKeys[api.id] || ''}
                                                            onChange={(e) => setCustomAPIKeys(prev => ({ ...prev, [api.id]: e.target.value }))}
                                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        />
                                                        <p className="text-[10px] text-slate-500">
                                                            Get your API key from {api.provider}'s developer portal
                                                        </p>
                                                        {customAPIKeys[api.id] && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                                                                <Check className="w-3 h-3" />
                                                                Custom key will be used
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {filteredAPIs.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold">No results match your search</p>
                            </div>
                        )}

                        {/* Selection Bar */}
                        {selectedAPIs.length > 0 && (
                            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                                <div className="bg-white rounded-2xl shadow-2xl px-8 py-5 flex items-center justify-between border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                            <Code className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-black text-slate-900 leading-tight">
                                                {selectedAPIs.length} Tool{selectedAPIs.length > 1 ? 's' : ''} Selected
                                            </div>
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cloud Deployment Ready</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setSelectedAPIs([])}
                                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={startDeployment}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95"
                                        >
                                            Deploy Now
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                }

                {/* Deployment Progress */}
                {
                    currentPage === 'deploying' && (
                        <div className="max-w-2xl mx-auto py-10">
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
                                <div className="bg-blue-600 px-8 py-12 text-white text-center relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Loader2 className="w-10 h-10 animate-spin" />
                                        </div>
                                        <h2 className="text-3xl font-black mb-2">Orchestrating Stack</h2>
                                        <p className="text-blue-50 font-medium">Provisioning Kubernetes pods and configuring network routes...</p>
                                    </div>
                                </div>

                                <div className="p-8 space-y-4">
                                    {selectedAPIs.map(apiId => {
                                        const api = AVAILABLE_APIS.find(a => a.id === apiId);
                                        const progress = deploymentProgress[apiId] || { status: 'initializing', message: 'Queueing...' };

                                        return (
                                            <div key={apiId} className="flex items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="font-bold text-slate-900 text-lg">{api.name}</div>
                                                        {progress.status === 'live' ? (
                                                            <div className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                                Active
                                                            </div>
                                                        ) : progress.status === 'error' ? (
                                                            <div className="text-xs font-black text-red-600 uppercase tracking-widest">Failed</div>
                                                        ) : (
                                                            <div className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse">Processing</div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-500 font-medium">{progress.message}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Dashboard */}
                {
                    currentPage === 'dashboard' && (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Active Stack</h2>
                                    <p className="text-slate-500 font-medium">{deployedAPIs.length} managed endpoint{deployedAPIs.length > 1 ? 's' : ''} currently stable</p>
                                </div>
                                <button
                                    onClick={() => setCurrentPage('catalog')}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all flex items-center gap-3 shadow-xl shadow-blue-600/10 active:scale-95"
                                >
                                    Add Connection
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid gap-6">
                                {deployedAPIs.map(api => (
                                    <div key={api.id} className="bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-lg transition-all shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h3 className="text-2xl font-black text-slate-900">{api.name}</h3>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Healthy</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 font-medium line-clamp-2 md:line-clamp-none">{api.description}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-200"
                                                    title="Documentation"
                                                >
                                                    <Code className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Production Gateway</label>
                                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
                                                    <code className="flex-1 text-sm text-blue-600 font-mono break-all font-bold">
                                                        {api.url}
                                                    </code>
                                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                                        <button
                                                            onClick={() => copyEndpoint(api.url)}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-all border border-slate-200"
                                                        >
                                                            {copiedEndpoint === api.url ? (
                                                                <><Check className="w-4 h-4 text-emerald-600" /> Copied</>
                                                            ) : (
                                                                <><Copy className="w-4 h-4" /> Copy URL</>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleTestAPI(api)}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-600/10"
                                                        >
                                                            Test <Zap className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Test Modal */}
                {
                    testModalAPI && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setTestModalAPI(null)}></div>
                            <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden border border-slate-200">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">Test Endpoint</h3>
                                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">{testModalAPI.name} / {testModalAPI.testConfig.method}</p>
                                    </div>
                                    <button onClick={() => setTestModalAPI(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                        <Code className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                    <div className="space-y-4">
                                        {testModalAPI.testConfig.fields.map(field => (
                                            <div key={field.name}>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{field.label}</label>
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        placeholder={field.placeholder}
                                                        value={testFormData[field.name] || ''}
                                                        onChange={(e) => setTestFormData({ ...testFormData, [field.name]: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px]"
                                                    />
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        value={testFormData[field.name] || ''}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        onChange={(e) => setTestFormData({ ...testFormData, [field.name]: e.target.value })}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={simulateAPITest}
                                            disabled={testLoading}
                                            className="py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20"
                                        >
                                            {testLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>Test UI <Zap className="w-5 h-5" /></>
                                            )}
                                        </button>
                                        <button
                                            onClick={runAPITest}
                                            disabled={testLoading}
                                            className="py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
                                        >
                                            {testLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>Live Test <ArrowRight className="w-5 h-5" /></>
                                            )}
                                        </button>
                                    </div>

                                    {testResponse && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Request Command</label>
                                                <pre className="p-4 bg-slate-900 rounded-2xl text-[11px] text-blue-300 font-mono overflow-x-auto border border-slate-800">
                                                    {testResponse.curl}
                                                </pre>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Response Output</label>
                                                <pre className={`p-4 rounded-2xl text-[11px] font-mono overflow-x-auto border ${testResponse.status === 'success' ? 'bg-emerald-950 text-emerald-400 border-emerald-900/50' : 'bg-red-950 text-red-400 border-red-900/50'
                                                    }`}>
                                                    {JSON.stringify(testResponse.data || { message: testResponse.message }, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Smart Agent Modal */}
                {showAssistant && (
                    <SmartAgent
                        onSelectStack={handleAIStackSelection}
                        onClose={() => setShowAssistant(false)}
                        availableApis={AVAILABLE_APIS}
                    />
                )}
            </main >

            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">© 2026 APIBazaar Infrastructure Engine. All systems operational.</p>
            </footer>
        </div >
    );
}
