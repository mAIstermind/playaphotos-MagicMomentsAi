import React from 'react';
import { BookOpen, DollarSign, Cpu, Settings, Trash2 } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen className="text-brand-600" />
          Agency User Manual
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Getting Started with Playa Photos & Magic Moments AI</p>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" /> 1. Connect Your Money
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 ml-2">
            <li>Go to the <strong>Admin Dashboard</strong> {'>'} <strong>Settings</strong>.</li>
            <li>Click <strong>Connect Stripe</strong>. This allows you to receive money directly from customers.</li>
            <li>You are the <strong>Merchant of Record</strong>. Payouts happen on your Stripe schedule.</li>
          </ol>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" /> 2. Connect Your AI Power
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 ml-2">
            <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Google Cloud Console</a>.</li>
            <li>Enable the <strong>Vertex AI API</strong>.</li>
            <li>Generate an <strong>API Key</strong>.</li>
            <li>Paste this key into <strong>Settings</strong> {'>'} <strong>AI Configuration</strong>.</li>
          </ol>
          <div className="mt-4 bg-amber-50 p-3 rounded-lg text-sm text-amber-800 border border-amber-200">
            <strong>Note:</strong> We cap usage at 100 generations/hour to protect your bill.
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" /> 3. Pricing & Integrations
          </h2>
          <ul className="space-y-4 text-slate-600">
            <li><strong>Set Your Prices:</strong> You control the pricing for Credits, Social Downloads, and Prints. Changes update instantly in the Checkout.</li>
            <li><strong>GoHighLevel (GHL):</strong> Paste your GHL Webhook URL in the Settings tab. We will send you a "New Customer" trigger whenever a sale is made.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" /> 4. Storage Rules
          </h2>
          <p className="text-slate-600">
            To save you money, we automatically delete <strong>High-Res (Print) files 30 days</strong> after generation. Your customers are warned of this on their download page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Documentation;