import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                    <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-500 font-medium">Log in to manage your API infrastructure</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/20 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log In <ArrowRight className="ml-2 w-4 h-4" /></>}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don’t have an account?{' '}
                            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500 underline underline-offset-4">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                    <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h2>
                <p className="mt-2 text-sm text-slate-500 font-medium">Join 2,000+ developers deploying APIs</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/20 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 underline underline-offset-4">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
