
import React, { useState, useEffect } from 'react';
import { Activity } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Partial<Activity>) => void;
  initialData?: Activity | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTime(initialData.time);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && time.trim()) {
      onSave({ name, time, description });
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-10 transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extralight text-gray-900 tracking-tight">
            {initialData ? 'Refine Event' : 'New Chronicle'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group">
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 group-focus-within:text-gray-900 transition-colors">
              Activity Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What occurred?"
              className="w-full px-0 py-2 bg-transparent border-b border-gray-100 focus:border-gray-900 transition-all outline-none text-xl font-light placeholder:text-gray-200"
              required
            />
          </div>

          <div className="group">
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 group-focus-within:text-gray-900 transition-colors">
              Timestamp
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-100 focus:border-gray-900 transition-all outline-none text-xl font-light cursor-pointer"
              required
            />
          </div>

          <div className="group">
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 group-focus-within:text-gray-900 transition-colors">
              Brief Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any nuances?"
              rows={2}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-100 focus:border-gray-900 transition-all outline-none text-base font-light placeholder:text-gray-200 resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-gray-900 text-white hover:bg-black rounded-2xl font-medium shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
            >
              {initialData ? 'Update Record' : 'Commit to Timeline'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-4 py-2 text-gray-300 hover:text-gray-900 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
