import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 p-8 border-b border-slate-100 flex items-center space-x-4">
          <div className="bg-white p-3 rounded-full shadow-sm text-slate-700">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        </div>
        
        <div className="p-8 space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">AI Generation Disclaimer</h2>
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500 flex items-start space-x-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
              <p className="text-amber-900 font-medium italic">
                "Caveat Emptor: AI Generations are artistic interpretations. Credits used for generation are non-refundable. Please verify the preview before purchase."
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">1. Service Usage</h2>
            <p>
              By using Playa Photos, you agree to not upload malicious content or use the generated images for illegal purposes. The platform provides tools for personal entertainment and event memorabilia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">2. Credits and Payments</h2>
            <p>
              Credits are a virtual currency used to perform AI actions. They have no monetary value outside of this platform and are non-transferable.
            </p>
          </section>

          <section>
             <h2 className="text-xl font-semibold text-slate-800 mb-2">3. Intellectual Property</h2>
             <p>
               You retain rights to your personal likeness. The Agency retains rights to the original photography. You are granted a personal, non-commercial license for purchased downloads unless specified otherwise.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;