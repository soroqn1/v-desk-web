import { useEffect, useState } from 'react';
import axios from 'axios';

interface SessionResponse {
  token: string;
}

interface Option {
  id: number;
  text: string;
}

interface Task {
  id: number;
  instruction: string;
  options: Option[];
}

function App() {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));

  useEffect(() => {
    const fetchToken = async () => {
      if (!token) {
        try {
          const response = await axios.get<SessionResponse>('http://localhost:3000/api/session');
          const newToken = response.data.token;
          sessionStorage.setItem('token', newToken);
          setToken(newToken);
        } catch (error) {
          console.error('Failed to get token:', error);
        }
      }
    };

    fetchToken();
  }, [token]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">

      {/* Header Section (always visible) */}
      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">V-Desk</h1>
        <p className="text-gray-500 mt-2">Interactive Programming Practice</p>
      </div>

      {/* CONDITIONAL RENDERING */}
      {tasks.length === 0 ? (
        // greeting
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md w-full">
          <div className="bg-[#50c878]/10 p-4 rounded-xl border border-[#50c878]/20 mb-6">
            <span className="text-[10px] font-bold text-[#50c878] uppercase tracking-widest block mb-1">Authenticated Session</span>
            <code className="text-xs font-mono text-[#45b068] break-all">{token || 'Resolving...'}</code>
          </div>

          <button
            onClick={loadTasks}
            className="w-full py-4 bg-[#50c878] hover:bg-[#45b068] text-white font-black rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#50c878]/30"
          >
            START WORKSHEET
          </button>
        </div>
      ) : (
        // list tasks
        <div className="w-full max-w-2xl space-y-6">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <span className="text-[#50c878] mr-2">#{task.id}</span>
                {task.instruction}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {task.options.map((option) => (
                  <button
                    key={option.id}
                    className="text-left p-4 rounded-xl border-2 border-gray-50 hover:border-[#50c878] hover:bg-emerald-50 transition-all group"
                  >
                    <span className="inline-block w-8 text-gray-400 group-hover:text-[#50c878] font-bold uppercase text-xs">Opt</span>
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;