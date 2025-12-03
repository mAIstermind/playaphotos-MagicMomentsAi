import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';

export const InstallPwa: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the native install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for custom trigger from Footer
    const handleTrigger = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            setDeferredPrompt(null);
          }
        });
      } else {
        // If no prompt available, check if iOS to show instructions
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS && !isInstalled) {
          setShowIOSPrompt(true);
        } else if (!isInstalled) {
           alert("To install, use your browser's menu and select 'Add to Home Screen' or 'Install App'.");
        }
      }
    };

    window.addEventListener('pwa-install-trigger', handleTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-install-trigger', handleTrigger);
    };
  }, [deferredPrompt, isInstalled]);

  if (isInstalled) return null;

  return (
    <>
      {/* iOS Instructions Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            <button 
              onClick={() => setShowIOSPrompt(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
               <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-inner">
                  <Smartphone className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Install App</h3>
               <p className="text-slate-500 text-sm mt-1">Add to Home Screen for the best experience.</p>
            </div>

            <div className="space-y-4 text-left">
               <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm border border-slate-100">1</span>
                  <div>
                     <p className="text-sm text-slate-700">Tap the <Share className="inline w-4 h-4 text-blue-500" /> <strong>Share</strong> button in your browser toolbar.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm border border-slate-100">2</span>
                  <div>
                     <p className="text-sm text-slate-700">Scroll down and tap <PlusSquare className="inline w-4 h-4 text-slate-700" /> <strong>Add to Home Screen</strong>.</p>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => setShowIOSPrompt(false)}
              className="w-full mt-6 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};