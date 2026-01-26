import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowLeft,
    BarChart2,
    Calendar,
    CreditCard,
    DollarSign,
    Download,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';

import confetti from 'canvas-confetti';

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('7d');
    const [isLoading, setIsLoading] = useState(true);
    const [showPricing, setShowPricing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState('Developer');

    const handleUpgrade = (planName) => {
        setShowPricing(false);
        setCurrentPlan(planName);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        // You could add a toast notification here
        alert(`Successfully upgraded to ${planName} plan!`);
    };

    const PricingModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPricing(false)}></div>
            <div className="bg-white rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">
                {/* Free Tier */}
                <div className="flex-1 p-8 border-r border-slate-100">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Developer</div>
                    <div className="text-4xl font-black text-slate-900 mb-6">$0</div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> 5,000 requests/mo
                        </li>
                        <li className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Standard latency
                        </li>
                        <li className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Community support
                        </li>
                    </ul>
                    <button
                        disabled={currentPlan === 'Developer'}
                        className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentPlan === 'Developer' ? 'Current Plan' : 'Downgrade'}
                    </button>
                </div>

                {/* Pro Tier (Highlighted) */}
                <div className="flex-1 p-8 bg-blue-50/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Recommended</div>
                    <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Startup</div>
                    <div className="text-4xl font-black text-slate-900 mb-6">$49<span className="text-lg text-slate-400 font-medium">/mo</span></div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-700 font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 1M requests/mo
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 99.9% SLA
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Priority Email Support
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Analytics Retention
                        </li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('Startup')}
                        disabled={currentPlan === 'Startup'}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:bg-blue-800 disabled:opacity-80"
                    >
                        {currentPlan === 'Startup' ? 'Current Plan' : 'Upgrade Now'}
                    </button>
                </div>

                {/* Enterprise Tier */}
                <div className="flex-1 p-8">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Enterprise</div>
                    <div className="text-4xl font-black text-slate-900 mb-6">Custom</div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Unlimited requests
                        </li>
                        <li className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Dedicated Account Mgr
                        </li>
                        <li className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> On-premise deployment
                        </li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('Enterprise')}
                        disabled={currentPlan === 'Enterprise'}
                        className="w-full py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-300 hover:text-slate-900 transition-colors"
                    >
                        {currentPlan === 'Enterprise' ? 'Contacted' : 'Contact Sales'}
                    </button>
                </div>
            </div>
        </div>
    );

    // Mock Data
    const stats = [
        {
            label: 'Total Requests',
            value: '2.4M',
            change: '+12.5%',
            isPositive: true,
            icon: Activity,
            color: 'blue'
        },
        {
            label: 'Avg. Latency',
            value: '145ms',
            change: '-4.2%',
            isPositive: true,
            icon: Zap,
            color: 'yellow'
        },
        {
            label: 'Error Rate',
            value: '0.05%',
            change: '+0.01%',
            isPositive: false,
            icon: BarChart2,
            color: 'red'
        },
        {
            label: 'Estimated Cost',
            value: '$432.50',
            change: '+8.1%',
            isPositive: false,
            icon: DollarSign,
            color: 'green'
        }
    ];

    const recentLogs = [
        { id: 'req_1', api: 'Email Service', endpoint: '/send-email', status: 200, latency: '120ms', time: '2 mins ago' },
        { id: 'req_2', api: 'Payment Gateway', endpoint: '/pay', status: 200, latency: '450ms', time: '5 mins ago' },
        { id: 'req_3', api: 'SMS Gateway', endpoint: '/send-sms', status: 400, latency: '80ms', time: '12 mins ago' },
        { id: 'req_4', api: 'Currency API', endpoint: '/convert', status: 200, latency: '95ms', time: '15 mins ago' },
        { id: 'req_5', api: 'Stock Market', endpoint: '/stock-price', status: 200, latency: '210ms', time: '22 mins ago' },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    const getStatusColor = (status) => {
        if (status >= 200 && status < 300) return 'text-green-600 bg-green-50';
        if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics & Usage</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        >
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                                    {stat.change}
                                    <TrendingUp className={`w-3 h-3 ml-1 ${!stat.isPositive && 'rotate-180'}`} />
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Area */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Traffic Overview</h2>
                        <div className="h-80 flex items-end gap-2 sm:gap-4">
                            {/* CSS-only Bar Chart Mock */}
                            {[...Array(12)].map((_, i) => {
                                const height = Math.floor(Math.random() * (100 - 30) + 30);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-blue-100 rounded-t-lg group-hover:bg-blue-600 transition-colors relative"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                                                {height * 100} reqs
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{i * 2}h</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Usage Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Cost Distribution</h2>
                        <div className="space-y-6">
                            {[
                                { name: 'Email API', percent: 45, cost: '$194.62', color: 'bg-blue-500' },
                                { name: 'SMS Gateway', percent: 30, cost: '$129.75', color: 'bg-purple-500' },
                                { name: 'Payment Processing', percent: 15, cost: '$64.87', color: 'bg-green-500' },
                                { name: 'Others', percent: 10, cost: '$43.26', color: 'bg-gray-300' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                        <span className="text-gray-900 font-bold">{item.cost}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${item.color}`}
                                            style={{ width: `${item.percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Plan Usage</h4>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>2.4M / 5M Requests</span>
                                <span>48%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gray-900 h-2 rounded-full" style={{ width: '48%' }}></div>
                            </div>
                            <button
                                onClick={() => setShowPricing(true)}
                                className="mt-4 w-full py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Modal */}
                {showPricing && <PricingModal />}

                {/* Recent Logs Table */}
                <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Logs</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">API Service</th>
                                    <th className="px-6 py-3">Endpoint</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Latency</th>
                                    <th className="px-6 py-3">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{log.api}</td>
                                        <td className="px-6 py-4 font-mono text-gray-600">{log.endpoint}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{log.latency}</td>
                                        <td className="px-6 py-4 text-gray-500">{log.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
