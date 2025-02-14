import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Twitter } from 'lucide-react';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [postsPerScroll, setPostsPerScroll] = useState(
    Number(localStorage.getItem('postsPerScroll')) || 2
  );

  useEffect(() => {
    localStorage.setItem('postsPerScroll', postsPerScroll.toString());
  }, [postsPerScroll]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4 px-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Configurações</h1>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Tema</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="text-yellow-500" size={24} />
                ) : (
                  <Moon className="text-gray-700" size={24} />
                )}
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 dark:text-gray-300">
                Posts por scroll
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map(number => (
                  <button
                    key={number}
                    onClick={() => setPostsPerScroll(number)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      postsPerScroll === number
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="https://x.com/Ander_pru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
              >
                <Twitter size={24} />
                <span>Seguir no Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}