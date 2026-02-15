
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface TestComponentProps {
  questions: Question[];
  title: string;
  topicId?: string;
  onComplete?: (score: number, total: number) => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ questions, title, topicId, onComplete }) => {
  const [configActive, setConfigActive] = useState(true);
  const [maxQuestions, setMaxQuestions] = useState(5);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const startTest = (count: number) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, count));
    setMaxQuestions(count);
    setConfigActive(false);
    setUserAnswers({});
    setScore(0);
    setCurrentIdx(0);
    setShowResult(false);
    setReviewMode(false);
  };

  const currentQuestion = activeQuestions[currentIdx];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setUserAnswers(prev => ({ ...prev, [currentIdx]: idx }));
    if (idx === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      if (topicId) {
        const completed = JSON.parse(localStorage.getItem('gramotey_completed_practice') || '[]');
        if (!completed.includes(topicId)) {
          localStorage.setItem('gramotey_completed_practice', JSON.stringify([...completed, topicId]));
        }
      }
      if (onComplete) onComplete(score, activeQuestions.length);
    }
  };

  if (configActive) {
    return (
      <div className="glass-card p-10 md:p-16 rounded-[3rem] shadow-2xl text-center max-w-2xl mx-auto border border-white/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-6">Параметры</div>
        <h2 className="text-3xl font-black mb-4 heading-font text-slate-900 tracking-tight">Настройка тренажера</h2>
        <p className="text-lg mb-12 text-slate-500 font-medium">Выберите объем тренировки для темы <br/><span className="text-slate-900 font-bold">«{title}»</span></p>
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[5, 10, 20].map(n => (
            <button
              key={n}
              onClick={() => startTest(n)}
              disabled={questions.length < n}
              className={`p-6 rounded-2xl border-2 font-black text-2xl transition-all shadow-md active:scale-95 ${
                questions.length >= n 
                ? 'bg-white border-slate-100 text-slate-900 hover:border-blue-600 hover:text-blue-600'
                : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
          Доступно в базе: {questions.length} вопросов
        </p>
      </div>
    );
  }

  if (showResult && !reviewMode) {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    const hasErrors = score < activeQuestions.length;

    return (
      <div className="glass-card p-10 md:p-16 rounded-[3.5rem] shadow-2xl text-center max-w-2xl mx-auto border border-white/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-9xl mb-10 drop-shadow-xl animate-bounce duration-[2000ms]">
          {percentage >= 90 ? '🏆' : percentage >= 75 ? '🥇' : percentage >= 50 ? '🥈' : '🥉'}
        </div>
        <h2 className="text-4xl font-black mb-4 heading-font text-slate-900 tracking-tight">
          {percentage >= 90 ? 'Абсолютный лидер!' : percentage >= 75 ? 'Блестящий результат!' : 'Хорошая попытка!'}
        </h2>
        <p className="text-xl mb-12 font-semibold text-slate-500 leading-relaxed">
          Ваш результат: <span className="text-blue-600 font-black">{score}</span> из <span className="text-slate-900 font-black">{activeQuestions.length}</span> ({percentage}%)
        </p>
        
        <div className="flex flex-col gap-4">
          {hasErrors && (
            <button 
              onClick={() => setReviewMode(true)}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest"
            >
              Разобрать ошибки
            </button>
          )}
          
          <button 
            onClick={() => setConfigActive(true)}
            className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
          >
            Новая тренировка
          </button>
        </div>
      </div>
    );
  }

  if (showResult && reviewMode) {
    const errorIndices = activeQuestions.map((_, i) => i).filter(i => userAnswers[i] !== activeQuestions[i].correctAnswer);
    
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-10 glass-card p-6 rounded-2xl shadow-lg border border-white/50">
           <h2 className="text-xl font-black text-slate-900 heading-font">Анализ ответов</h2>
           <button onClick={() => setReviewMode(false)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] hover:bg-black transition-all active:scale-95 uppercase tracking-widest">
             К итогам
           </button>
        </div>

        <div className="space-y-6">
          {errorIndices.map(idx => {
            const q = activeQuestions[idx];
            return (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <p className="text-2xl font-black text-slate-900 mb-8 leading-tight">{q.text}</p>
                
                <div className="grid gap-3 mb-8">
                  {q.options.map((opt, i) => {
                    let borderClass = "border-slate-100 text-slate-400";
                    let bgClass = "bg-slate-50/50";
                    let label = (i + 1).toString();

                    if (i === q.correctAnswer) {
                      borderClass = "border-emerald-500 text-emerald-700";
                      bgClass = "bg-emerald-50";
                      label = "✓";
                    } else if (i === userAnswers[idx]) {
                      borderClass = "border-red-500 text-red-700";
                      bgClass = "bg-red-50";
                      label = "✗";
                    }

                    return (
                      <div key={i} className={`p-5 rounded-xl border-2 font-bold text-sm flex items-center ${bgClass} ${borderClass}`}>
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4 text-[10px] shrink-0 font-black">
                          {label}
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100/50">
                  <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3">Разбор ситуации</p>
                  <p className="text-amber-900 font-bold text-lg leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setConfigActive(true)}
          className="mt-12 w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]"
        >
          Закончить анализ
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 md:p-14 rounded-[3.5rem] shadow-2xl max-w-2xl mx-auto border border-white/50 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{title}</h2>
        <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-lg shadow-lg tracking-widest">
          {currentIdx + 1} / {activeQuestions.length}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-14 overflow-hidden shadow-inner">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
        ></div>
      </div>

      <p className="text-3xl md:text-4xl font-black text-slate-900 mb-14 leading-tight heading-font">{currentQuestion.text}</p>

      <div className="grid gap-4 mb-14">
        {currentQuestion.options.map((option, i) => {
          let stateStyles = 'bg-white border-slate-100 text-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md hover:scale-[1.01]';
          
          if (isAnswered) {
            if (i === currentQuestion.correctAnswer) {
              stateStyles = 'bg-emerald-500 border-emerald-600 text-white font-black ring-8 ring-emerald-50 scale-[1.03] z-10 shadow-xl';
            } else if (i === selectedOption) {
              stateStyles = 'bg-red-500 border-red-600 text-white font-black';
            } else {
              stateStyles = 'bg-slate-50 border-slate-100 text-slate-300 opacity-40 grayscale';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isAnswered}
              className={`text-left p-6 md:p-7 rounded-2xl border-2 transition-all duration-300 text-xl outline-none active:scale-[0.98] ${stateStyles}`}
            >
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-xl border-2 border-current flex items-center justify-center mr-6 text-xs font-black shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mb-14 p-8 bg-amber-50 rounded-3xl border border-amber-100/50 text-amber-900 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Комментарий эксперта</p>
          <p className="font-bold text-lg leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button 
          onClick={nextQuestion}
          className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 text-sm uppercase tracking-[0.2em]"
        >
          {currentIdx === activeQuestions.length - 1 ? 'ФИНАЛИЗИРОВАТЬ' : 'СЛЕДУЮЩИЙ ШАГ →'}
        </button>
      )}
    </div>
  );
};

export default TestComponent;
