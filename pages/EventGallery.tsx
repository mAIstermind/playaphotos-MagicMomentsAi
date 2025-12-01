import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../contexts/CartContext';
import { CartDrawer } from '../components/CartDrawer';
import { Camera, Search, ShoppingBag, Wand2, Download, Image as ImageIcon, X, Loader2, AlertCircle } from 'lucide-react';
import * as faceapi from 'face-api.js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// --- Types ---
interface PhotoData {
  id: string;
  originalUrl: string;
  watermarkedUrl: string;
  embedding?: number[];
  price?: number;
}

interface EventData {
  id: string;
  name: string;
  agencyId: string;
  date: string;
  pricing: {
    socialPrice: number;
    printPrice: number;
    originalPrice: number;
    creditPrice: number;
  }
}

const EventGallery = () => {
  const { agencySlug, eventSlug, eventId: paramEventId } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'camera' | 'processing'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { addToCart, toggleCart, itemCount } = useCart();

  // --- 1. Load Event Data ---
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        let eventId = paramEventId;

        // Resolve Slug if present
        if (agencySlug && eventSlug) {
           const q = query(collection(db, 'events'), where('slug', '==', eventSlug));
           const snap = await getDocs(q);
           if (!snap.empty) {
             eventId = snap.docs[0].id;
           } else {
             console.error("Event not found by slug");
             setLoading(false);
             return;
           }
        }

        if (!eventId) return;

        // Get Event Details
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setEvent({
            id: eventDoc.id,
            name: data.name,
            agencyId: data.agencyId,
            date: data.date,
            pricing: data.pricing || { socialPrice: 0.99, printPrice: 9.99, originalPrice: 19.99, creditPrice: 1.00 }
          });

          // Get Photos
          const photoQ = query(collection(db, 'photos'), where('eventId', '==', eventId));
          const photoSnap = await getDocs(photoQ);
          const photoList = photoSnap.docs.map(d => ({ id: d.id, ...d.data() } as PhotoData));
          setPhotos(photoList);
          setFilteredPhotos(photoList);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [agencySlug, eventSlug, paramEventId]);

  // --- 2. Load Face API Models ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models'; // Must be in public/models
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setFaceApiLoaded(true);
      } catch (e) {
        console.warn("Face API models not found. Face search disabled.", e);
      }
    };
    loadModels();
  }, []);

  // --- 3. Face Search Logic ---
  const startCamera = async () => {
    setSearchStatus('camera');
    setSearchError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setSearchError("Camera access denied.");
    }
  };

  const captureAndSearch = async () => {
    if (!videoRef.current || !faceApiLoaded) return;
    setSearchStatus('processing');

    try {
      // Detect face from video element
      const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
      
      if (!detection) {
        setSearchError("No face detected. Try again.");
        setSearchStatus('camera');
        return;
      }

      // Stop Camera
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());

      // Filter photos based on Euclidean distance
      // Note: This requires photos in Firestore to have 'embedding' field populated
      const matched = photos.filter(p => {
        if (!p.embedding || p.embedding.length === 0) return true; // Keep unidentified photos? Or hide?
        // Simple Euclidean distance
        const dist = faceapi.euclideanDistance(detection.descriptor, p.embedding as unknown as Float32Array);
        return dist < 0.6; // Threshold
      });

      setFilteredPhotos(matched.length > 0 ? matched : photos); // Fallback to all if none found
      setIsSearching(false);
      
      if (matched.length === 0) alert("No matches found. Showing all photos.");
      
    } catch (err) {
      console.error(err);
      setSearchError("Analysis failed.");
    } finally {
      setSearchStatus('idle');
    }
  };

  const resetSearch = () => {
    setFilteredPhotos(photos);
    setIsSearching(false);
    setSearchStatus('idle');
  };

  // --- Render ---
  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-brand-600" /></div>;
  if (!event) return <div className="p-10 text-center">Event not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <CartDrawer />

      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{event.name}</h1>
            <p className="text-sm text-slate-500">{event.date}</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={toggleCart}
               className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full"
             >
               <ShoppingBag />
               {itemCount > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{itemCount}</span>}
             </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-center">
            {filteredPhotos.length !== photos.length ? (
                <button onClick={resetSearch} className="flex items-center gap-2 text-sm text-brand-600 font-medium">
                    <X size={16} /> Clear Filter (Showing {filteredPhotos.length} of {photos.length})
                </button>
            ) : (
                <button 
                  onClick={() => setIsSearching(true)}
                  className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-full text-sm font-medium text-slate-600 shadow-sm hover:border-brand-500"
                >
                  <Search size={16} /> Find My Photos
                </button>
            )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearching && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
              <button onClick={resetSearch} className="absolute top-4 right-4 z-10 p-2 bg-black/20 rounded-full text-white"><X /></button>
              
              {searchStatus === 'idle' && (
                <div className="p-8 text-center">
                   <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-brand-600" />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Find Your Face</h3>
                   <p className="text-slate-500 mb-8">We use secure, local AI to find matches. No photos are stored.</p>
                   <div className="space-y-3">
                     <button onClick={startCamera} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700">Take Selfie</button>
                     <button className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-bold">Upload Photo</button>
                   </div>
                   {!faceApiLoaded && <p className="text-xs text-red-400 mt-4">AI Models loading... please wait.</p>}
                </div>
              )}

              {searchStatus === 'camera' && (
                 <div className="relative bg-black aspect-[3/4]">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                       <button onClick={captureAndSearch} className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 shadow-lg"></button>
                    </div>
                    {searchError && <div className="absolute top-4 left-4 right-12 bg-red-500 text-white p-2 rounded text-sm">{searchError}</div>}
                 </div>
              )}

              {searchStatus === 'processing' && (
                  <div className="p-12 text-center">
                     <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
                     <p className="font-bold">Scanning Gallery...</p>
                  </div>
              )}
           </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="relative group bg-slate-200 rounded-lg overflow-hidden aspect-[2/3]" onContextMenu={(e) => e.preventDefault()}>
               <img src={photo.watermarkedUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
               
               {/* Heavy Watermark Overlay */}
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                  <span className="text-4xl font-black text-white -rotate-45 select-none">PREVIEW</span>
               </div>
               
               {/* Drag Protection */}
               <div className="absolute inset-0 z-10"></div>

               {/* Hover Actions */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-end p-4">
                  <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform">
                      <button 
                        onClick={() => addToCart({
                          photoId: photo.id,
                          thumbnailUrl: photo.watermarkedUrl,
                          type: 'social',
                          price: event.pricing.socialPrice,
                          label: 'Social Download'
                        })}
                        className="w-full bg-white/10 backdrop-blur text-white text-sm py-2 rounded-lg hover:bg-white/20 flex items-center justify-center gap-2"
                      >
                         <Download size={14} /> Social (${event.pricing.socialPrice})
                      </button>
                      <button 
                         onClick={() => addToCart({
                            photoId: photo.id,
                            thumbnailUrl: photo.watermarkedUrl,
                            type: 'remix',
                            price: event.pricing.creditPrice,
                            label: 'AI Remix Credit'
                         })}
                         className="w-full bg-brand-600 text-white text-sm py-2 rounded-lg hover:bg-brand-500 flex items-center justify-center gap-2 shadow-lg"
                      >
                         <Wand2 size={14} /> Remix (${event.pricing.creditPrice})
                      </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
        
        {filteredPhotos.length === 0 && (
           <div className="text-center py-20 text-slate-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>No photos found.</p>
           </div>
        )}
      </div>

    </div>
  );
};

export default EventGallery;