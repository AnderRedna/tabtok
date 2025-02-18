import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FilterOption = 'all' | 'pitch' | 'question';

interface PostFilterProps {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export default function PostFilter({ selectedFilter, onFilterChange }: PostFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = (filter: FilterOption) => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-24 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 right-0 bg-white dark:bg-zinc-800 rounded-lg shadow-lg dark:shadow-zinc-900/50 overflow-hidden mb-2 w-40"
            >
              <button
                onClick={() => handleFilterClick('all')}
                className={`w-full px-4 py-3 text-left ${
                  selectedFilter === 'all'
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-zinc-100'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleFilterClick('pitch')}
                className={`w-full px-4 py-3 text-left ${
                  selectedFilter === 'pitch'
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-zinc-100'
                }`}
              >
                Pitch
              </button>
              <button
                onClick={() => handleFilterClick('question')}
                className={`w-full px-4 py-3 text-left ${
                  selectedFilter === 'question'
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-zinc-100'
                }`}
              >
                Dúvida
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            isOpen 
              ? 'bg-blue-500 text-white dark:bg-blue-600' 
              : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100'
          }`}
        >
          <Filter size={24} />
        </button>
      </div>
    </>
  );
}
