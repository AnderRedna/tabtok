import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  isPulling: boolean;
  pullProgress: number;
  isRefreshing: boolean;
}

export default function PullToRefresh({ isPulling, pullProgress, isRefreshing }: PullToRefreshProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: isPulling || isRefreshing ? 20 : -50 }}
        className="bg-blue-500 text-white rounded-full p-2 shadow-lg flex items-center gap-2"
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : pullProgress * 360 }}
          transition={{ duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0 }}
        >
          <RefreshCw size={20} />
        </motion.div>
        <span className="text-sm">
          {isRefreshing ? 'Atualizando...' : 'Puxe para atualizar'}
        </span>
      </motion.div>
    </div>
  );
}
