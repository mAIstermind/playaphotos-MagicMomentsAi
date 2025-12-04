2. Create src/pages/Pricing.tsx
Navigate to: src/pages/

Action: Create a new file named Pricing.tsx.

Paste this code:

TypeScript

import React from 'react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Social',
    id: 'tier-social',
    href: '#',
    priceMonthly: '$4.99',
    description: 'Perfect for sharing on Instagram, Facebook, and TikTok.',
    features: ['Standard Resolution (2MP)', 'Light Watermark Removed', 'Instant Download', 'Personal Use License'],
    featured: false,
  },
  {
    name: 'Print',
    id: 'tier-print',
    href: '#',
    priceMonthly: '$14.99',
    description: 'Full resolution files suitable for framing and large prints.',
    features: ['Maximum Resolution (24MP+)', 'No Watermark', 'Print Release Included', 'Priority Support'],
    featured: true,
  },
  {
    name: 'AI Remix',
    id: 'tier-ai',
    href: '#',
    priceMonthly: '$0.99',
    description: 'Transform your photo into something magical.',
    features: ['1 AI Generation Credit', 'Unique Artistic Style', 'Downloadable Result', 'Fun & Shareable'],
    featured: false,
  },
];

const Pricing = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Choose the perfect format for your memories. From social shares to living room art.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`${
                tier.featured ? 'relative bg-slate-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0'
              } ${
                tier.featured ? '' : tierIdx === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl' : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none'
              } rounded-3xl p-8 ring-1 ring-slate-900/10 sm:p-10`}
            >
              <h3 className={`text-base font-semibold leading-7 ${tier.featured ? 'text-brand-400' : 'text-brand-600'}`}>
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className={`text-5xl font-bold tracking-tight ${tier.featured ? 'text-white' : 'text-slate-900'}`}>
                  {tier.priceMonthly}
                </span>
                <span className={`text-base ${tier.featured ? 'text-slate-400' : 'text-slate-500'}`}>/photo</span>
              </p>
              <p className={`mt-6 text-base leading-7 ${tier.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                {tier.description}
              </p>
              <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 ${tier.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className={`h-6 w-5 flex-none ${tier.featured ? 'text-brand-400' : 'text-brand-600'}`} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;