import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../lib/firebase';
import { ArrowLeft, Upload, Trash2, CheckSquare, Square } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const EventUploadManager = () => {
  const { eventId } = useParams();
  const [photos, setPhotos] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!eventId) return;
    const q = query(collection(db, 'photos'), where('eventId', '==', eventId));
    const unsubscribe = onSnapshot(q, (snapshot) => setPhotos(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [eventId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    const files = Array.from(e.target.files);
    for (const fileObj of files) {
      const file = fileObj as File;
      try {
        const path = `agency_uploads/${auth.currentUser?.uid}/${eventId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await addDoc(collection(db, 'photos'), { eventId, agencyId: auth.currentUser?.uid, originalUrl: url, watermarkedUrl: url, status: 'active', createdAt: serverTimestamp(), embedding: [] });
      } catch (err) { console.error(err); }
    }
    setIsUploading(false);
  };

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selectedPhotos.size} photos?`)) return;
    for (const id of selectedPhotos) await deleteDoc(doc(db, 'photos', id));
    setSelectedPhotos(new Set());
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedPhotos);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedPhotos(newSet);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-8">
        <div className="flex gap-4"><Link to="/admin/events" className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></Link><h1 className="text-2xl font-bold">Manage Photos</h1></div>
        {selectedPhotos.size > 0 && <button onClick={deleteSelected} className="bg-red-600 text-white px-3 py-2 rounded flex gap-2"><Trash2 className="w-4 h-4" /> Delete ({selectedPhotos.size})</button>}
      </div>
      <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer mb-8 ${isUploading ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
        <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
        {isUploading ? <p className="text-indigo-600 font-bold">Uploading...</p> : <div className="text-center"><Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p>Upload Photos</p></div>}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {photos.map(p => (
          <div key={p.id} onClick={() => toggleSelect(p.id)} className={`aspect-square relative group bg-slate-100 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedPhotos.has(p.id) ? 'border-indigo-600' : 'border-transparent'}`}>
            <img src={p.originalUrl} className="w-full h-full object-cover" />
            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPhotos.has(p.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-black/30 border-white'}`}>
              {selectedPhotos.has(p.id) && <CheckSquare className="w-4 h-4 text-white" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EventUploadManager;