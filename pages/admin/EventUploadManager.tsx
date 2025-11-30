import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../lib/firebase';
import { ArrowLeft, Upload, Loader, Image as ImageIcon, Trash2 } from 'lucide-react';

const EventUploadManager = () => {
  const { eventId } = useParams();
  const [photos, setPhotos] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch Photos
  useEffect(() => {
    if (!eventId) return;
    const q = query(collection(db, 'photos'), where('eventId', '==', eventId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [eventId]);

  // Handle Upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // Safety check for auth
    if (!auth.currentUser) {
      alert("You must be logged in to upload photos.");
      return;
    }

    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    let completed = 0;
    for (const file of files) {
      try {
        const path = `agency_uploads/${auth.currentUser.uid}/${eventId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'photos'), {
          eventId,
          agencyId: auth.currentUser.uid,
          originalUrl: url,
          watermarkedUrl: url, // Placeholder: In a real app, a Cloud Function would generate this
          status: 'active',
          createdAt: serverTimestamp(),
          embedding: [] 
        });
        completed++;
        setUploadProgress((completed / files.length) * 100);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
    setIsUploading(false);
    setUploadProgress(0);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/events" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Photos</h1>
          <p className="text-slate-500 text-sm">Upload high-resolution images for this event.</p>
        </div>
      </div>

      <label className={`
        border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer mb-8 transition-colors
        ${isUploading ? 'bg-indigo-50 border-indigo-300' : 'hover:bg-slate-50 border-slate-300 hover:border-brand-400'}
      `}>
        <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
        {isUploading ? (
          <div className="flex flex-col items-center">
             <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
             <p className="text-indigo-600 font-bold">Uploading... {Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <>
            <div className="bg-indigo-50 p-3 rounded-full mb-3">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="font-medium text-slate-700 text-lg">Click to Upload Photos</p>
            <p className="text-sm text-slate-400 mt-1">JPG, PNG supported</p>
          </>
        )}
      </label>

      {photos.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No photos uploaded yet</p>
              <p className="text-slate-400 text-sm">Upload photos to see them here.</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="aspect-square relative group bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <img src={photo.originalUrl} className="w-full h-full object-cover" alt="" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default EventUploadManager;