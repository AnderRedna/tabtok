import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Twitter } from 'lucide-react';

const procrastinationMessages = [
  "Você está a muito tempo scrollando, acho melhor você não procrastinar!",
  "Hey, que tal fazer uma pausa? Você já scrollou bastante!",
  "Lembre-se: produtividade é importante! Talvez seja hora de voltar ao trabalho?",
  "Scrolling infinito não é tão produtivo quanto parece...",
  "Já considerou fazer uma pausa para esticar as pernas?",
  "Que tal dar uma pausa e beber água?",
  "Seus olhos merecem um descanso, não acha?",
  "Muita informação por hoje, não?",
];

export default function ProcrastinationCard() {
  const randomMessage = procrastinationMessages[
    Math.floor(Math.random() * procrastinationMessages.length)
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-purple-100 dark:bg-purple-900 rounded-lg shadow-md p-4 mb-4 w-full"
    >
      <div className="flex items-start mb-4">
        <div className="w-8 h-8 rounded-full mr-2 bg-purple-500 flex items-center justify-center">
          <Coffee className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-sm dark:text-purple-100">@TabTok</h3>
          <p className="text-xs text-purple-600 dark:text-purple-300">
            Hora do intervalo!
          </p>
        </div>
      </div>

      <h2 className="text-base font-bold mb-2 text-purple-800 dark:text-purple-100">
        {randomMessage}
      </h2>
      <p className="text-sm text-purple-700 dark:text-purple-200 mb-4">
        Lembre-se de descansar um pouco. Alongue-se, beba água e volte quando estiver pronto! 😊
      </p>

      <a
        href="https://x.com/Ander_pru"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
      >
        <Twitter size={18} />
        <span className="text-sm">Siga-me no Twitter</span>
      </a>
    </motion.div>
  );
}
