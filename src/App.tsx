/// <reference types="vite/client" />
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));

  useEffect(() => {
    const fetchToken = async () => {
      if (!token) {
        try {
          const response = await axios.get<SessionResponse>(`${API_URL}/api/session`);
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
      const response = await axios.get<Task[]>(`${API_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const [results, setResults] = useState<Record<number, any>>({});

  const submitAnswer = async (taskId: number, optionId: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/task/${taskId}/answer`,
        { optionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(prev => ({
        ...prev,
        [taskId]: {
          correct: response.data.correct,
          selectedOptionId: optionId
        }
      }));
    } catch (error) {
      console.error("Answer submission failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">

      {/* Header Section (always visible) */}
      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">V-Desk</h1>
        <p className="text-gray-500 mt-2">V-Desk is a web application that allows users to practice by solving tasks</p>
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
          {tasks.map((task, index) => (
            <div key={task.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <span className="text-[#50c878] mr-2">#{index + 1}</span>
                {task.instruction}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {task.options.map((option) => {
                  const result = results[task.id];
                  const isSelected = result?.selectedOptionId === option.id;
                  const isCorrect = isSelected && result.correct;
                  const isWrong = isSelected && !result.correct;
                  const hasAnswered = !!result;

                  return (
                    <button
                      key={option.id}
                      onClick={() => submitAnswer(task.id, option.id)}
                      className={`
        w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between
        ${!isSelected ? 'border-gray-100 hover:border-[#50c878] hover:bg-emerald-50' : ''}
        ${isCorrect ? 'border-green-500 bg-green-50 text-green-700' : ''}
        ${isWrong ? 'border-red-500 bg-red-50 text-red-700' : ''}
        ${hasAnswered && !isSelected ? 'opacity-40' : ''}
      `}
                    >
                      <span className="font-medium">{option.text}</span>
                      {isSelected && (
                        <span className="font-bold">{isCorrect ? '✓' : '✗'}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;