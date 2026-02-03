'use client';

import { motion } from 'framer-motion';

interface OasisScoreProps {
  score: number; // 0-100
}

export function OasisScore({ score }: OasisScoreProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0 opacity-50" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-4">Oasis Score</h3>
        
        <div className="relative flex items-center justify-center">
          {/* Background Circle */}
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            {/* Progress Circle */}
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
              className="text-teal-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold text-slate-800">{score}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        <p className="mt-4 text-center text-slate-600 text-sm max-w-[200px]">
          Tu impacto como agente de cambio está creciendo.
        </p>
      </div>
    </div>
  );
}
