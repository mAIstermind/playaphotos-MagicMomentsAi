import React from 'react';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const Success = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
       <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Complete!</h1>
          <p className="text-slate-500 mb-8">Your payment was successful. You can download your photos below.</p>
          
          <div className="space-y-4 mb-8">
             <button className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 shadow-lg flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download All Photos (ZIP)
             </button>
             <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm flex items-start gap-3 text-left">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>We've also sent a backup download link and your receipt to your email address.</p>
             </div>
          </div>

          <Link to="/" className="text-slate-400 hover:text-slate-600 text-sm">
             Return to Home
          </Link>
       </div>
    </div>
  );
};

export default Success;