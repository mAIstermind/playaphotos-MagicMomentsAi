import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-brand-50 p-8 border-b border-brand-100 flex items-center space-x-4">
          <div className="bg-white p-3 rounded-full shadow-sm text-brand-600">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        </div>
        
        <div className="p-8 space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Data Protection Commitment</h2>
            <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 text-blue-900 font-medium">
              "We prioritize your privacy. Facial analysis is performed locally on your device to find your photos and is not stored on our servers. Original event photos are retained for archival purposes. Generated AI scenarios and Purchased High-Res downloads are stored for 30 days before automatic deletion."
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">1. Information Collection</h2>
            <p>
              We collect information necessary to provide the photography service, including uploaded event photos and user-generated AI content. We do not sell your personal biometric data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">2. Local Processing</h2>
            <p>
              Our "Find My Face" feature utilizes client-side technology (face-api.js). This means the analysis happens right in your browser. No facial fingerprints are sent to our cloud for identification purposes.
            </p>
          </section>

          <section>
             <h2 className="text-xl font-semibold text-slate-800 mb-2">3. Content Retention</h2>
             <ul className="list-disc pl-5 space-y-1">
               <li>Original event photos: Retained per agency agreement.</li>
               <li>AI Generations: Deleted automatically after 30 days.</li>
               <li>Purchased Downloads: Download links valid for 30 days.</li>
             </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;