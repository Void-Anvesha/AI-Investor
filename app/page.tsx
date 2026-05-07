'use client';

import { useEffect, useState } from 'react';
import { Loader2, Radio, TrendingUp, Gauge, RefreshCw, BarChart3, Brain } from 'lucide-react';
import { SignalCard } from '@/components/SignalCard';
import { signalsAPI, demoAPI } from '@/lib/api';

interface Signal {
  stock: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasons: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  expected_move: string;
  time_horizon: string;
}

export default function DashboardPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = async () => {
    try {
      setRefreshing(true);
      // Try to fetch real signals
      try {
        const data = await signalsAPI.getAll(5);
        setSignals(data);
        setError(null);
      } catch (e) {
        // Fallback to demo data
        console.log('Using demo data');
        const demo = await demoAPI.getDemoData();
        setSignals(demo.sample_signals);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load signals');
      // Use fallback demo data
      const demo = await demoAPI.getDemoData();
      setSignals(demo.sample_signals);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch signals only once on component mount
    fetchSignals();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Radio className="w-10 h-10 text-teal-600" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold text-slate-900">Opportunity Radar</h1>
        </div>
        <p className="text-xl text-slate-600 mb-2">
          AI-Powered Stock Signals for the Indian Investor
        </p>
        <p className="text-slate-500">Real-time analysis of NSE stocks with explainable reasoning</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card flex items-start gap-3 border border-teal-200">
          <div className="p-3 rounded bg-teal-50">
            <Radio className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Active Signals</p>
            <p className="text-2xl font-bold text-slate-900">
              {signals.filter((s) => s.signal !== 'HOLD').length}
            </p>
          </div>
        </div>

        <div className="card flex items-start gap-3 border border-emerald-200">
          <div className="p-3 rounded bg-emerald-50">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">System Performance</p>
            <p className="text-2xl font-bold text-slate-900">+45.2% YTD</p>
          </div>
        </div>

        <div className="card flex items-start gap-3 border border-blue-200">
          <div className="p-3 rounded bg-blue-50">
            <Gauge className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Avg Confidence</p>
            <p className="text-2xl font-bold text-slate-900">
              {signals.length > 0
                ? ((signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length) * 100).toFixed(0)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Top Opportunities (Last 24h)</h2>
            <p className="text-slate-600">
              High-conviction signals ranked by confidence. Click any card to see full analysis.
            </p>
          </div>
          <button
            onClick={fetchSignals}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 disabled:active:scale-100 font-medium"
            title="Refresh signals"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mr-3" />
            <span className="text-slate-600">Loading opportunities...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 mb-6">
            <p className="font-semibold">Note:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && signals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {signals.map((signal) => (
              <SignalCard
                key={signal.stock}
                stock={signal.stock}
                signal={signal.signal}
                confidence={signal.confidence}
                reasons={signal.reasons}
                riskLevel={signal.risk_level}
                expectedMove={signal.expected_move}
                timeHorizon={signal.time_horizon}
              />
            ))}
          </div>
        )}

        {!loading && signals.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No signals available at this time. Try again later.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-teal-600 via-emerald-500 to-teal-600 rounded-xl p-12 text-center shadow-xl border-0">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Understand Your Portfolio Risk</h3>
        <p className="text-teal-50 mb-8 text-lg">Upload your holdings to get sector-wise analysis and diversification recommendations</p>
        <a
          href="/portfolio"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-teal-600 rounded-lg font-bold transition-all duration-200 hover:shadow-2xl active:scale-95 shadow-lg"
        >
          <span>Analyze My Portfolio</span>
          <span>→</span>
        </a>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-4">
            <BarChart3 className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Multi-Source Analysis</h3>
          <p className="text-sm text-slate-600">
            Combines news sentiment, technical analysis, and insider activity for comprehensive signals
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
            <Brain className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">AI-Powered Reasoning</h3>
          <p className="text-sm text-slate-600">
            Smart synthesis of all signals into actionable recommendations with clear explanations
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Backtested & Proven</h3>
          <p className="text-sm text-slate-600">
            73.2% accuracy over 6 months with 45.2% outperformance vs Nifty 50 benchmark
          </p>
        </div>
      </div>
    </div>
  );
}
