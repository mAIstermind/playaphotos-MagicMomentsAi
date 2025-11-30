import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, storage, auth } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  orderBy, 
  deleteDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Upload, 
  ArrowLeft, 
  Image as ImageIcon, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { RoutePaths } from '../../types';

interface UploadStatus {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
}

const EventUploadManager: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventName, setEventName] = useState('Loading Event...');
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadQueue, setUploadQueue] = useState<UploadStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Event Details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEventName(docSnap.data().name);
        } else {
          setEventName('Event Not Found');
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  // 2. Real-time Photos Listener
  useEffect(() => {
    if (!eventId) return;

    const q = query(
      collection(db, 'photos'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(fetchedPhotos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  // 3. File Upload Logic
  const handleFiles = async (files: FileList | null) => {
    if (!files || !eventId || !auth.currentUser) return;

    const newUploads: UploadStatus[] = Array.from(files).map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    }));

    setUploadQueue(prev => [...newUploads, ...prev]);

    // Process each file
    Array.from(files).forEach(async (file) => {
      try {
        // Create Storage Ref: agency_uploads/{uid}/{eventId}/{filename}
        const storageRef = ref(storage, `agency_uploads/${auth.currentUser?.uid}/${eventId}/${file.name}-${Date.now()}`);
        
        // Upload
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update Queue Status (Success)
        setUploadQueue(prev => prev.map(item => 
          item.fileName === file.name ? { ...item, status: 'success', url: downloadURL, progress: 100 } : item
        ));

        // Save to Firestore
        await addDoc(collection(db, 'photos'), {
          eventId: eventId,
          agencyId: auth.currentUser?.uid,
          originalUrl: downloadURL,
          watermarkedUrl: downloadURL, // Using original as placeholder for now
          thumbnailUrl: downloadURL,
          embedding: [], // Placeholder for AI
          createdAt: serverTimestamp(),
          status: 'active'
        });

      } catch (error) {
        console.error("Upload failed for", file.name, error);
        setUploadQueue(prev => prev.map(item => 
          item.fileName === file.name ? { ...item, status: 'error', progress: 0 } : item
        ));
      }
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const deletePhoto = async (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      await deleteDoc(doc(db, 'photos', photoId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link to={RoutePaths.ADMIN_EVENTS} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-slate-900">{eventName}</h1>
           <p className="text-slate-500 text-sm">Upload and manage gallery photos</p>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className={`
          border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
          ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleFiles(e.target.files)} 
        />
        
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Drag & Drop photos here</h3>
        <p className="text-slate-500 mt-2">or click to browse from your computer</p>
        <p className="text-xs text-slate-400 mt-4">Supports JPG, PNG (Max 10MB)</p>
      </div>

      {/* Upload Queue (Visible only during activity) */}
      {uploadQueue.length > 0 && uploadQueue.some(u => u.status !== 'success') && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h4 className="font-semibold text-sm text-slate-700">Upload Status</h4>
          {uploadQueue.filter(u => u.status !== 'success').map((item, idx) => (
             <div key={idx} className="flex items-center justify-between text-sm">
                <span className="truncate max-w-xs">{item.fileName}</span>
                {item.status === 'uploading' && <Loader2 className="animate-spin w-4 h-4 text-brand-600" />}
                {item.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
             </div>
          ))}
        </div>
      )}

      {/* Photo Grid */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Gallery Photos ({photos.length})</h3>
         </div>
         
         {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="aspect-square bg-slate-100 rounded-lg animate-pulse"></div>
             ))}
           </div>
         ) : photos.length === 0 ? (
           <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
             <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500">No photos uploaded yet.</p>
           </div>
         ) : (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {photos.map((photo) => (
               <div key={photo.id} className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                 <img 
                   src={photo.thumbnailUrl || photo.originalUrl} 
                   alt="Gallery item" 
                   className="w-full h-full object-cover"
                   loading="lazy"
                 />
                 
                 {/* Overlay Actions */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      onClick={() => deletePhoto(photo.id)}
                      className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-white hover:scale-110 transition-all shadow-sm"
                      title="Delete Photo"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default EventUploadManager;