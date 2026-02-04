
import React, { useState, useEffect } from 'react';
import { Activity, AIInsight } from './types';
import ActivityModal from './components/ActivityModal';
import TimelineItem from './components/TimelineItem';
import { analyzeActivities } from './services/geminiService';
import { db } from './services/supabaseService';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await db.fetchActivities();
      if (data.length > 0) {
        setActivities(data);
      } else {
        // Fallback to local storage if DB is empty or first run
        const saved = localStorage.getItem('chronicle_activities');
        if (saved) {
          const parsed = JSON.parse(saved);
          setActivities(parsed.sort((a: Activity, b: Activity) => a.time.localeCompare(b.time)));
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Sync to local storage as secondary backup
  useEffect(() => {
    localStorage.setItem('chronicle_activities', JSON.stringify(activities));
  }, [activities]);

  const handleAddClick = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = async (data: Partial<Activity>) => {
    setIsSyncing(true);
    let updatedActivity: Activity;
    
    if (selectedActivity) {
      updatedActivity = { ...selectedActivity, ...data } as Activity;
    } else {
      updatedActivity = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name!,
        time: data.time!,
        description: data.description,
        timestamp: Date.now()
      };
    }

    const success = await db.upsertActivity(updatedActivity);
    
    if (success) {
      setActivities(prev => {
        const filtered = prev.filter(a => a.id !== updatedActivity.id);
        return [...filtered, updatedActivity].sort((a, b) => a.time.localeCompare(b.time));
      });
    } else {
      alert("Failed to sync with cloud. Check your configuration.");
    }
    setIsSyncing(false);
  };

  const handleDeleteActivity = async (id: string) => {
    if (window.confirm('Delete this record?')) {
      setIsSyncing(true);
      const success = await db.deleteActivity(id);
      if (success) {
        setActivities(prev => prev.filter(a => a.id !== id));
      } else {
        alert("Failed to delete from cloud.");
      }
      setIsSyncing(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeActivities(activities);
    setInsight(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center selection:bg-gray-900 selection:text-white">
      <header className="w-full max-w-5xl px-8 py-16 md:py-24 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
        <div className="text-center md:text-left animate-in fade-in slide-in-from-top-4 duration-700 relative">
          <h1 className="text-6xl font-extralight text-gray-900 tracking-tighter">Chronicle</h1>
          <p className="text-gray-400 mt-4 text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed flex items-center justify-center md:justify-start gap-3">
            Minimal architecture for your days
            {isSyncing && (
              <span className="flex items-center gap-1.5 text-gray-300 animate-pulse-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span className="text-[8px] tracking-[0.2em]">Syncing</span>
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-gray-900 text-white px-10 py-5 rounded-full hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center gap-3 group active:scale-95 animate-in fade-in slide-in-from-right-4 duration-1000"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium text-sm tracking-widest uppercase">New Event</span>
        </button>
      </header>

      <main className="w-full flex-grow relative max-w-6xl pb-40">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-20 animate-pulse">
            <div className="w-1 h-20 bg-gray-900 rounded-full mb-4"></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Establishing Connection</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="relative pt-20">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gray-200 opacity-60"></div>
            
            <div className="relative z-10 flex flex-col">
              {activities.map((activity, index) => (
                <TimelineItem 
                  key={activity.id} 
                  activity={activity} 
                  index={index} 
                  onClick={handleEditClick}
                  onDelete={handleDeleteActivity}
                />
              ))}
            </div>

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
              <div className="mt-6 text-[9px] font-bold text-gray-300 uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr]">Chronicle</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in duration-1000">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-sm border border-gray-100">
              <svg className="w-10 h-10 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-300 font-light text-xl italic tracking-wide">The timeline is silent.</p>
            <button 
              onClick={handleAddClick}
              className="mt-10 text-[10px] font-bold text-gray-900 uppercase tracking-widest hover:bg-gray-900 hover:text-white px-8 py-3 border border-gray-900 rounded-full transition-all"
            >
              Begin Journaling
            </button>
          </div>
        )}

        {activities.length > 0 && !isLoading && (
          <div className="mt-60 px-8 max-w-2xl mx-auto">
            {!insight ? (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="group flex flex-col items-center gap-6 mx-auto disabled:opacity-50"
                >
                  <div className={`p-6 rounded-full transition-all duration-700 ${isAnalyzing ? 'bg-gray-100 scale-90' : 'bg-white shadow-sm border border-gray-100 group-hover:shadow-2xl group-hover:shadow-gray-200/50 group-hover:-translate-y-2'}`}>
                    {isAnalyzing ? (
                      <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-gray-300 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.5em] transition-colors ${isAnalyzing ? 'text-gray-400' : 'text-gray-400 group-hover:text-gray-900'}`}>
                    {isAnalyzing ? 'Analyzing Flow...' : 'Synthesize Day'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[48px] p-16 shadow-2xl shadow-gray-200/50 border border-gray-50 animate-in fade-in zoom-in-95 duration-700">
                <div className="flex flex-col items-center mb-12">
                   <div className="p-4 bg-gray-900 rounded-3xl mb-6 shadow-xl shadow-gray-900/20">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                   </div>
                   <h2 className="text-2xl font-light text-gray-900 tracking-tight">Daily Synthesis</h2>
                </div>
                <p className="text-gray-500 text-xl leading-relaxed mb-12 font-light italic text-center px-4">
                  "{insight.summary}"
                </p>
                <div className="space-y-6">
                  {insight.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-start gap-6 p-6 bg-gray-50 rounded-[32px] border border-transparent hover:border-gray-100 transition-all duration-300">
                       <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">{i+1}</span>
                       <p className="text-sm text-gray-600 font-medium leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-16 flex justify-center">
                  <button 
                    onClick={() => setInsight(null)}
                    className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-bold hover:text-gray-900 transition-colors border-b border-transparent hover:border-gray-900 pb-2"
                  >
                    Discard Synthesis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <ActivityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        initialData={selectedActivity}
      />

      <footer className="py-32 w-full text-center opacity-30">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.8em]">Minimalism is the ultimate sophistication</p>
      </footer>
    </div>
  );
};

export default App;
