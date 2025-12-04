import React from 'react';
import { ShieldCheck, Wand2, Smartphone, Zap, Lock, Share2 } from 'lucide-react';

const Features = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Features that wow.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Everything you need to turn event photos into a viral sensation. Secure, fast, and magical.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <ShieldCheck className="h-5 w-5 flex-none text-brand-600" />
                Privacy-First Face Search
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">We don't store biometric data on servers. Our AI runs directly in your browser, finding your photos instantly without compromising privacy.</p>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <Wand2 className="h-5 w-5 flex-none text-purple-600" />
                AI Remixes
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Let guests reimagine their photos. Turn a wedding selfie into a fairytale oil painting or a cyberpunk poster instantly.</p>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <Smartphone className="h-5 w-5 flex-none text-blue-600" />
                Mobile Optimized
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Works perfectly on any phone. Users can install it as a PWA (App) for instant access to their memories.</p>
              </dd>
            </div>

             <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <Zap className="h-5 w-5 flex-none text-yellow-500" />
                Instant Delivery
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">No waiting. Digital downloads are delivered via email and direct download link seconds after purchase.</p>
              </dd>
            </div>

             <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <Lock className="h-5 w-5 flex-none text-green-600" />
                Secure Payments
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Powered by Stripe Connect. Transactions are encrypted and secure.</p>
              </dd>
            </div>

             <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <Share2 className="h-5 w-5 flex-none text-pink-600" />
                Social Ready
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Photos are optimized for Instagram and TikTok sharing, driving more visibility to your event.</p>
              </dd>
            </div>

          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;