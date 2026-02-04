import React from 'react';
import { Activity } from '../types';

interface TimelineItemProps {
  activity: Activity;
  index: number;
  onClick: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ activity, index, onClick, onDelete }) => {
  const isEven = index % 2 === 0;

  return (
    <div className="relative w-full flex justify-center mb-20 last:mb-0 group">
      {/* Central Axis Point */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="absolute top-1/2 -translate-y-1/2 z-20">
           {/* Pulsing hover background for the dot */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900/5 scale-0 group-hover:scale-125 transition-transform duration-500 ease-out" />
           
           <button
            onClick={() => onClick(activity)}
            className="relative w-4 h-4 bg-white border-2 border-gray-900 rounded-full shadow-sm transition-all duration-300 group-hover:bg-gray-900 group-hover:scale-110 focus:ring-4 focus:ring-gray-100 outline-none z-30"
            title="Edit activity"
          />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center">
        {/* Left Side Content (Desktop) */}
        <div className={`hidden md:flex flex-1 justify-end pr-16 text-right transition-all duration-700 ${!isEven ? 'opacity-0 pointer-events-none translate-x-8' : 'opacity-100 translate-x-0'}`}>
          <div 
            onClick={() => onClick(activity)}
            className="max-w-xs p-6 rounded-[32px] cursor-pointer bg-transparent hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transform transition-all duration-300 hover:-translate-y-2 group-hover:border-transparent border border-transparent"
          >
             <span className="inline-block px-2.5 py-1 bg-gray-100 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-4">
               {activity.time}
             </span>
             <h3 className="text-2xl font-light text-gray-900 leading-tight">
               {activity.name}
             </h3>
             {activity.description && (
               <p className="mt-3 text-xs text-gray-400 font-light leading-relaxed line-clamp-2">{activity.description}</p>
             )}
          </div>
        </div>

        {/* Central Gap Placeholder for Desktop */}
        <div className="hidden md:block w-8 h-8 mx-4 invisible" />

        {/* Right Side Content (Desktop) */}
        <div className={`hidden md:flex flex-1 justify-start pl-16 text-left transition-all duration-700 ${isEven ? 'opacity-0 pointer-events-none -translate-x-8' : 'opacity-100 translate-x-0'}`}>
          <div 
            onClick={() => onClick(activity)}
            className="max-w-xs p-6 rounded-[32px] cursor-pointer bg-transparent hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transform transition-all duration-300 hover:-translate-y-2 group-hover:border-transparent border border-transparent"
          >
             <span className="inline-block px-2.5 py-1 bg-gray-100 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-4">
               {activity.time}
             </span>
             <h3 className="text-2xl font-light text-gray-900 leading-tight">
               {activity.name}
             </h3>
             {activity.description && (
               <p className="mt-3 text-xs text-gray-400 font-light leading-relaxed line-clamp-2">{activity.description}</p>
             )}
          </div>
        </div>

        {/* Mobile View Content */}
        <div 
          onClick={() => onClick(activity)}
          className="md:hidden flex flex-col items-center w-full px-8 text-center cursor-pointer group/mobile active:scale-[0.98] transition-transform"
        >
           <div className="p-6 bg-white rounded-[32px] shadow-sm border border-gray-100 w-full">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full mb-3 inline-block">
              {activity.time}
             </span>
             <h3 className="text-xl font-light text-gray-900 mb-2">{activity.name}</h3>
             {activity.description && (
               <p className="text-xs text-gray-400 font-light mb-4">{activity.description}</p>
             )}
             <div className="flex justify-center gap-8 mt-2 border-t border-gray-50 pt-4">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  Tap to Edit
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }}
                  className="text-[10px] font-bold text-red-300 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
             </div>
           </div>
        </div>

        {/* Floating Quick Actions (Desktop Only) */}
        <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isEven ? 'right-4 lg:right-16' : 'left-4 lg:left-16'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }}
            className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            title="Delete activity"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
