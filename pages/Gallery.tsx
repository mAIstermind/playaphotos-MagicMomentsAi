import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Search, X, ShieldCheck, AlertCircle, Loader2, User, ChevronRight } from 'lucide-react';

const MOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1519671482538-30715c3276dd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800"
];

type SearchStep = 'idle' | 'selection' | 'privacy-consent' | 'camera-active' | 'processing';

const Gallery: React.FC = () => {
  const [searchStep, setSearchStep] = useState<SearchStep>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    try {
      // Explicitly check for support first
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      setStream(mediaStream);
      setSearchStep('camera-active');
    } catch (err: any) {
      console.error("Camera error:", err);
      // Ensure stream is null if it partially started
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera permission was denied. Please use the 'Upload Photo' option instead.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera device found. Please use 'Upload Photo'.");
      } else {
        setError("Unable to access camera. Please try 'Upload Photo' instead.");
      }
    }
  };

  const handleCapture = () => {
    // In a real app, we would capture the frame here using canvas
    setSearchStep('processing');
    
    // Simulate processing delay
    setTimeout(() => {
        // Stop camera immediately after capture
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setSearchStep('idle');
        // Here we would filter the gallery...
    }, 2000);
  };

  const closeModal = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setSearchStep('idle');
    setError(null);
  };

  const handleUploadClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // User selected a file
      setSearchStep('processing');
      // Simulate processing
      setTimeout(() => {
        setSearchStep('idle');
      }, 2000);
    }
  };

  // Setup video stream when element is ready
  useEffect(() => {
    if (searchStep === 'camera-active' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [searchStep, stream]);

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Gallery</h1>
          <p className="text-slate-500 text-sm">Sunset Soirée 2024</p>
        </div>
        
        <button 
          onClick={() => setSearchStep('selection')}
          className="flex items-center justify-center space-x-2 bg-brand-600 text-white px-6 py-3 rounded-full hover:bg-brand-700 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
        >
          <Search size={18} />
          <span>Find My Photos</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_PHOTOS.map((url, index) => (
          <div key={index} className="aspect-square rounded-xl overflow-hidden bg-slate-200 relative group cursor-pointer">
            <img 
              src={url} 
              alt={`Event photo ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Search Modal */}
      {searchStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* 1. Selection Step */}
            {searchStep === 'selection' && (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-6">
                   <User size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Find Your Photos</h3>
                <p className="text-slate-500 mb-8">
                  Choose a method to scan the gallery for your face.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setSearchStep('privacy-consent')}
                    className="w-full flex items-center justify-between bg-brand-600 text-white p-4 rounded-xl hover:bg-brand-700 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                        <Camera size={20} />
                        <span className="font-medium">Take a Selfie</span>
                    </div>
                    <ChevronRight size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={handleUploadClick}
                    className="w-full flex items-center justify-between bg-white border-2 border-slate-200 text-slate-700 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                        <Upload size={20} />
                        <span className="font-medium">Upload Photo</span>
                    </div>
                    <ChevronRight size={20} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Privacy Consent Step */}
            {searchStep === 'privacy-consent' && (
              <div className="p-8">
                <div className="flex items-center space-x-2 text-brand-600 mb-6 bg-brand-50 w-fit px-3 py-1 rounded-full">
                  <ShieldCheck size={16} />
                  <span className="font-bold text-xs uppercase tracking-wide">Privacy Notice</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Camera Access Required</h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  To find your photos, we need to temporarily access your camera to analyze your face.
                </p>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-8">
                  <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          <span><strong>Local Processing:</strong> Face matching happens on your device.</span>
                      </li>
                      <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          <span><strong>Private:</strong> We do not store your biometric data.</span>
                      </li>
                  </ul>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button 
                    onClick={() => setSearchStep('selection')}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={startCamera}
                    className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Enable Camera
                  </button>
                </div>
              </div>
            )}

            {/* 3. Camera Active Step */}
            {searchStep === 'camera-active' && (
              <div className="relative bg-black h-[400px] flex flex-col">
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted 
                   className="absolute inset-0 w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 pointer-events-none border-[3rem] border-black/40"></div>
                 
                 <div className="absolute top-4 left-0 right-0 text-center z-20">
                    <span className="bg-black/50 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
                        Position your face in the center
                    </span>
                 </div>

                 <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center z-20 bg-gradient-to-t from-black/60 to-transparent">
                    <button 
                      onClick={handleCapture}
                      className="w-16 h-16 rounded-full border-[6px] border-white/30 bg-white hover:bg-white/90 transition-all scale-100 hover:scale-105 shadow-2xl"
                      aria-label="Take Photo"
                    />
                 </div>
              </div>
            )}

            {/* 4. Processing Step */}
            {searchStep === 'processing' && (
              <div className="p-12 text-center">
                 <div className="relative mx-auto w-16 h-16 mb-4">
                     <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                     <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
                     <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-brand-600" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Scanning Gallery...</h3>
                 <p className="text-slate-500 mt-2">Matching your unique features.</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-50 text-red-700 p-4 rounded-xl flex items-start space-x-3 border border-red-100 shadow-lg animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="font-medium text-sm">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700">
                    <X size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;