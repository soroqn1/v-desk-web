import { useEffect, useState } from 'react';
import axios from 'axios';

interface SessionResponse {
  token: string;
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-[#50c878]">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Virtual Front Desk</h1>
        <p className="text-gray-500 mb-6">Software Engineering Practice Project</p>

        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <span className="block text-xs font-bold text-emerald-600 uppercase mb-1">Session Identity</span>
            <code className="block text-sm font-mono text-emerald-800 break-all">
              {token || 'Handshaking...'}
            </code>
          </div>

          <button className="w-full py-3 bg-[#50c878] hover:bg-[#45b068] text-white font-bold rounded-lg transition-colors">
            Start Worksheet
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;