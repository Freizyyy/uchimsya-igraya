
import React, { useState, useEffect } from 'react';
import { Orphogram, CheckingWordExercise } from '../types';

interface TheoryCardProps {
  orphogram: Orphogram;
  onBack: () => void;
  onComplete?: () => void;
}

const TheoryCard: React.FC<TheoryCardProps> = ({ orphogram, onBack, onComplete }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    if (idx === orphogram.miniQuiz?.correctAnswer) {
      // Save completion state
      const completed = JSON.parse(localStorage.getItem('gramotey_completed_theory') || '[]');
      if (!completed.includes(orphogram.id)) {
        localStorage.setItem('gramotey_completed_theory', JSON.stringify([...completed, orphogram.id]));
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-8 text-gray-900 font-black flex items-center bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95"
      >
        ← Назад к списку тем
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-8 md:p-12 flex-grow">
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 heading-font leading-tight">
            {orphogram.title}
          </h3>
          <div className="prose prose-blue max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              {orphogram.content}
            </p>
          </div>
          
          <div className="bg-blue-50/50 rounded-3xl p-6 md:p-8 mb-8 border-2 border-blue-100">
            <h4 className="text-xs font-black text-blue-800 uppercase tracking-[0.2em] mb-4">Наглядные примеры</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-blue-900 font-bold">
              {orphogram.examples.map((ex, i) => (
                <div key={i} className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0"></span>
                  {ex}
                </div>
              ))}
            </div>
          </div>

          {orphogram.checkingWordExercises && (
            <div className="mb-8">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <span className="mr-2 text-xl">✏️</span> Практическое закрепление
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orphogram.checkingWordExercises.map((ex, i) => (
                  <CheckingWordItem key={i} exercise={ex} />
                ))}
              </div>
            </div>
          )}
        </div>

        {orphogram.miniQuiz && (
          <div className="bg-gray-50 p-8 md:p-12 border-t-4 border-blue-600">
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Интерактивный блиц</h4>
            <p className="text-2xl font-black text-gray-900 mb-8">{orphogram.miniQuiz.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {orphogram.miniQuiz.options.map((opt, i) => {
                let btnClass = "p-6 rounded-2xl border-2 text-xl font-black transition-all duration-300 ";
                if (!isAnswered) {
                  btnClass += "bg-white border-gray-200 hover:border-blue-500 text-gray-700 shadow-sm hover:-translate-y-1";
                } else {
                  if (i === orphogram.miniQuiz!.correctAnswer) {
                    btnClass += "bg-green-600 border-green-700 text-white shadow-lg ring-4 ring-green-100";
                  } else if (i === selected) {
                    btnClass += "bg-red-600 border-red-700 text-white";
                  } else {
                    btnClass += "bg-gray-100 border-gray-200 text-gray-300 opacity-50";
                  }
                }
                return (
                  <button 
                    key={i} 
                    disabled={isAnswered}
                    onClick={() => handleAnswer(i)}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="mt-8 p-6 bg-white border-2 border-blue-100 rounded-2xl text-blue-900 font-bold text-lg animate-in fade-in slide-in-from-top-2">
                <span className="mr-2 text-2xl">💡</span>
                {orphogram.miniQuiz.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CheckingWordItem: React.FC<{ exercise: CheckingWordExercise }> = ({ exercise }) => {
  const [val, setVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const check = () => {
    const trimmedVal = val.toLowerCase().trim();
    const trimmedAnswer = exercise.answer.toLowerCase().trim();
    if (trimmedVal === trimmedAnswer) {
      setStatus('success');
    } else if (trimmedVal !== '') {
      setStatus('error');
    }
  };

  return (
    <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
      status === 'success' ? 'bg-green-50 border-green-500' : 
      status === 'error' ? 'bg-red-50 border-red-500' : 'bg-white border-gray-100'
    }`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-black text-gray-900 text-lg uppercase tracking-tight">{exercise.word} —</span>
          {status !== 'idle' && (
            <span className={`text-xs font-black uppercase tracking-widest ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {status === 'success' ? 'Верно!' : 'Ошибка'}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              setStatus('idle');
            }}
            className="flex-grow min-w-0 px-4 py-3 text-lg font-bold border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-colors"
            placeholder="Проверочное..."
          />
          <button 
            onClick={check}
            className="bg-gray-900 text-white px-5 py-3 rounded-xl font-black hover:bg-black transition-all active:scale-95"
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryCard;
