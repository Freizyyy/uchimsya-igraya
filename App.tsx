
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import TheoryCard from './components/TheoryCard';
import TestComponent from './components/TestComponent';
import { Section, Orphogram, ArenaTask } from './types';
import { ORPHOGRAMS, MNEMONICS, PRACTICE_QUESTIONS, ARENA_TASKS, FINAL_TEST } from './constants';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>(Section.HOME);
  const [selectedOrphogramId, setSelectedOrphogramId] = useState<string | null>(null);
  const [selectedTheoryId, setSelectedTheoryId] = useState<string | null>(null);
  
  const [completedTheory, setCompletedTheory] = useState<string[]>([]);
  const [completedPractice, setCompletedPractice] = useState<string[]>([]);

  useEffect(() => {
    const theory = JSON.parse(localStorage.getItem('gramotey_completed_theory') || '[]');
    const practice = JSON.parse(localStorage.getItem('gramotey_completed_practice') || '[]');
    setCompletedTheory(theory);
    setCompletedPractice(practice);
  }, []);

  const handleTheoryComplete = () => {
    const theory = JSON.parse(localStorage.getItem('gramotey_completed_theory') || '[]');
    setCompletedTheory(theory);
  };

  const handlePracticeComplete = () => {
    const practice = JSON.parse(localStorage.getItem('gramotey_completed_practice') || '[]');
    setCompletedPractice(practice);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection, selectedOrphogramId, selectedTheoryId]);

  const getSectionProgress = (type: 'theory' | 'practice') => {
    const completed = type === 'theory' ? completedTheory : completedPractice;
    return Math.round((completed.length / ORPHOGRAMS.length) * 100);
  };

  const calculateOverallProgress = () => {
    const totalPossible = ORPHOGRAMS.length * 2;
    const totalDone = completedTheory.length + completedPractice.length;
    return totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
  };

  const renderHome = () => {
    const overallProgress = calculateOverallProgress();
    
    return (
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Образовательная платформа 2026</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 heading-font leading-tight tracking-tight">
            Будущее твоей <br/><span className="text-blue-600 italic">грамотности</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Интерактивное пространство для освоения русского языка через геймификацию, стихи и практику.
          </p>
        </div>

        <div className="mb-24">
          <GlobalProgressDashboard progress={overallProgress} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <HomeCard 
            title="Теория" 
            description="База правил в формате компактных интерактивных карточек."
            details={["Лаконичные формулировки", "Умные примеры", "Мини-контроль"]}
            progress={getSectionProgress('theory')}
            icon="📚"
            color="blue"
            onClick={() => setCurrentSection(Section.THEORY)}
          />
          <HomeCard 
            title="Стихи" 
            description="Мнемонические рифмы для легкого запоминания исключений и сложных тем."
            details={["Авторские стихи", "Визуальные якоря", "Тесты на память"]}
            progress={0} 
            icon="🎨"
            color="purple"
            onClick={() => setCurrentSection(Section.MNEMONICS)}
          />
          <HomeCard 
            title="Тренажер" 
            description="Закрепление каждой орфограммы через персонализированные тесты."
            details={["Индивидуальный объем", "Адаптивная сложность", "Мгновенный разбор"]}
            progress={getSectionProgress('practice')}
            icon="🎯"
            color="green"
            onClick={() => setCurrentSection(Section.PRACTICE)}
          />
          <HomeCard 
            title="Арена" 
            description="Интерактивный редактор для поиска и исправления ошибок в контексте."
            details={["Режим детектива", "Работа с текстом", "Подсказки эксперта"]}
            progress={0}
            icon="⚔️"
            color="red"
            onClick={() => setCurrentSection(Section.ARENA)}
          />
          <HomeCard 
            title="Итоговый тест" 
            description="Генеральная проверка всех знаний школьного курса."
            details={["20 сложных вопросов", "Полный отчет", "Трофей знатока"]}
            progress={0}
            icon="🏆"
            color="amber"
            onClick={() => setCurrentSection(Section.FINAL_TEST)}
          />
        </div>
      </div>
    );
  };

  const renderTheory = () => {
    if (selectedTheoryId) {
      const orphogram = ORPHOGRAMS.find(o => o.id === selectedTheoryId);
      if (orphogram) {
        return (
          <div className="pt-28 pb-10 px-4 animate-in fade-in zoom-in-95 duration-500">
            <TheoryCard 
              orphogram={orphogram} 
              onBack={() => setSelectedTheoryId(null)} 
              onComplete={handleTheoryComplete}
            />
          </div>
        );
      }
    }

    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-10 animate-in fade-in slide-in-from-bottom-4">
        <div className="mb-12 border-l-8 border-blue-600 pl-8 py-2">
          <h2 className="text-4xl md:text-5xl font-black heading-font text-slate-900 mb-2">Библиотека знаний</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">9 фундаментальных тем орфографии</p>
        </div>
        
        <div className="space-y-4">
          {ORPHOGRAMS.map((o, idx) => (
            <ExpandableTopicCard 
              key={o.id}
              topic={o}
              index={idx}
              isCompleted={completedTheory.includes(o.id)}
              buttonLabel="Открыть урок →"
              color="blue"
              onAction={() => setSelectedTheoryId(o.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderMnemonics = () => (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-12 border-l-8 border-purple-600 pl-8 py-2">
        <h2 className="text-4xl md:text-5xl font-black heading-font text-slate-900 mb-2">Правила в рифмах</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Легкий путь к запоминанию через поэзию ({MNEMONICS.length} правил)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {MNEMONICS.map(m => (
          <MnemonicCard key={m.id} mnemonic={m} />
        ))}
      </div>
    </div>
  );

  const renderPractice = () => {
    if (selectedOrphogramId) {
      const questions = PRACTICE_QUESTIONS[selectedOrphogramId] || [];
      const orphogram = ORPHOGRAMS.find(o => o.id === selectedOrphogramId);
      
      return (
        <div className="max-w-4xl mx-auto px-4 pt-32 pb-10 animate-in fade-in zoom-in-95 duration-500">
          <button 
            onClick={() => setSelectedOrphogramId(null)}
            className="mb-8 text-slate-900 font-bold flex items-center bg-white px-6 py-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            ← Вернуться к списку
          </button>
          {questions.length > 0 ? (
            <TestComponent 
              title={orphogram?.title || ''} 
              topicId={selectedOrphogramId}
              questions={questions} 
              onComplete={handlePracticeComplete} 
            />
          ) : (
            <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-6 opacity-20">⚙️</div>
              <p className="text-slate-400 font-black text-xl uppercase tracking-widest">Раздел пополняется</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-10 animate-in fade-in slide-in-from-bottom-4">
        <div className="mb-12 border-l-8 border-green-600 pl-8 py-2">
          <h2 className="text-4xl md:text-5xl font-black heading-font text-slate-900 mb-2">Зал тренировок</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Закрепляй знания на практике</p>
        </div>
        <div className="space-y-4">
          {ORPHOGRAMS.map((o, idx) => (
            <ExpandableTopicCard 
              key={o.id}
              topic={o}
              index={idx}
              isCompleted={completedPractice.includes(o.id)}
              buttonLabel="Начать практику →"
              color="green"
              onAction={() => setSelectedOrphogramId(o.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderArena = () => (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-12 border-l-8 border-red-600 pl-8 py-2">
        <h2 className="text-4xl md:text-5xl font-black heading-font text-slate-900 mb-2">Арена грамотности</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Найди и исправь все скрытые ошибки</p>
      </div>
      <div className="space-y-12">
        {ARENA_TASKS.map(task => (
          <ArenaCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );

  const renderFinalTest = () => (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black mb-4 heading-font text-slate-900 tracking-tighter">Финальный вызов</h2>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">Комплексный экзамен из 20 вопросов. Только для настоящих экспертов.</p>
      </div>
      <TestComponent 
        title="Итоговая аттестация" 
        questions={FINAL_TEST} 
        onComplete={() => {}} 
      />
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case Section.THEORY: return renderTheory();
      case Section.MNEMONICS: return renderMnemonics();
      case Section.PRACTICE: return renderPractice();
      case Section.ARENA: return renderArena();
      case Section.FINAL_TEST: return renderFinalTest();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentSection={currentSection} setSection={(s) => {
        setCurrentSection(s);
        setSelectedOrphogramId(null);
        setSelectedTheoryId(null);
      }} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="mt-20 py-16 bg-white/80 border-t border-slate-200 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="text-left">
            <h4 className="text-2xl font-black text-slate-900 heading-font mb-2 tracking-tight">УЧИМСЯ ИГРАЯ</h4>
            <p className="text-slate-400 font-semibold text-sm mb-6">Личный навигатор в мире русского языка.</p>
            <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">
              © 2026 Интерактивная платформа. Все права защищены.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Обратная связь</h5>
            <a 
              href="tel:+79139303008" 
              className="group flex items-center gap-4 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <span className="font-bold text-lg">+7 913 930 30 08</span>
            </a>
            <a 
              href="mailto:zakharova.n136@yandex.ru" 
              className="group flex items-center gap-4 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <span className="font-bold text-lg">zakharova.n136@yandex.ru</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- MODERN COMPONENTS (Dashboard, HomeCard, ExpandableTopicCard, MnemonicCard, ArenaCard remains similar) ---
// ... (Including components here to ensure file completeness)

const GlobalProgressDashboard: React.FC<{ progress: number }> = ({ progress }) => {
  const getTreeStage = () => {
    if (progress === 0) return { icon: '🌱', label: 'РОСТОК ЗНАНИЙ', color: 'text-emerald-400', bg: 'bg-emerald-50' };
    if (progress < 25) return { icon: '🌿', label: 'ПЕРВЫЕ УСПЕХИ', color: 'text-emerald-500', bg: 'bg-emerald-100/50' };
    if (progress < 50) return { icon: '🌳', label: 'УВЕРЕННЫЙ РОСТ', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (progress < 75) return { icon: '🌲', label: 'МАСТЕРСКИЙ УРОВЕНЬ', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (progress < 100) return { icon: '🌸', label: 'ЦВЕТУЩИЙ РАЗУМ', color: 'text-purple-500', bg: 'bg-purple-50' };
    return { icon: '👑', label: 'ГРАМОТЕЙ 2026', color: 'text-amber-500', bg: 'bg-amber-50' };
  };

  const stage = getTreeStage();

  return (
    <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-48 -mt-48 transition-transform group-hover:scale-110 duration-1000"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="shrink-0 flex flex-col items-center">
          <div className="text-[120px] leading-none mb-6 animate-pulse transition-transform duration-700 hover:rotate-3 cursor-default">
            {stage.icon}
          </div>
          <div className={`text-sm font-black tracking-[0.3em] ${stage.color}`}>{stage.label}</div>
        </div>
        
        <div className="flex-grow w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h3 className="text-3xl font-black text-slate-900 heading-font mb-2 tracking-tight">Ваш статус обучения</h3>
              <p className="text-slate-500 font-semibold text-lg">Вы освоили материал на <span className="text-blue-600 font-black">{progress}%</span></p>
            </div>
          </div>
          
          <div className="relative pt-2">
            <div className="h-6 w-full bg-slate-100 rounded-2xl overflow-hidden border border-white shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:2rem_2rem] animate-[move-bg_2s_linear_infinite]"></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className={`px-4 py-2 rounded-xl text-xs font-bold ${stage.bg} ${stage.color} border border-current/10`}>
              {progress === 0 ? 'Начните с теории' : progress === 100 ? 'Вы — легенда!' : 'Продолжайте движение'}
            </div>
            <div className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-widest">
              Все разделы активны
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes move-bg {
          0% { background-position: 0 0; }
          100% { background-position: 2rem 0; }
        }
      `}</style>
    </div>
  );
};

const HomeCard: React.FC<{
  title: string;
  description: string;
  details: string[];
  progress: number;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'red' | 'amber';
  onClick: () => void;
}> = ({ title, description, details, progress, icon, color, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colors = {
    blue: 'border-blue-100 bg-white hover:border-blue-600 shadow-blue-50',
    purple: 'border-purple-100 bg-white hover:border-purple-600 shadow-purple-50',
    green: 'border-green-100 bg-white hover:border-green-600 shadow-green-50',
    red: 'border-red-100 bg-white hover:border-red-600 shadow-red-50',
    amber: 'border-amber-100 bg-white hover:border-amber-600 shadow-amber-50',
  };

  const accentColors = {
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    amber: 'text-amber-600 bg-amber-50',
  };

  const barColors = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    amber: 'bg-amber-600',
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 group flex flex-col h-full ${
        isExpanded ? 'shadow-2xl ring-1 ring-slate-100 z-10 scale-[1.02]' : 'hover:shadow-xl hover:-translate-y-2'
      } ${colors[color]}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`text-5xl transition-transform duration-500 ${isExpanded ? 'scale-110' : 'group-hover:rotate-12'}`}>
          {icon}
        </div>
        {progress > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Прогресс</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-md ${accentColors[color]}`}>{progress}%</span>
          </div>
        )}
      </div>

      <h3 className="text-2xl font-black text-slate-900 heading-font mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-6">
        {description}
      </p>

      {progress > 0 && (
        <div className="w-full h-1 bg-slate-100 rounded-full mb-6 overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${barColors[color]}`} style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className={`expand-grid ${isExpanded ? 'expanded' : ''}`}>
        <div className="expand-inner">
          <div className="pt-2 pb-6 space-y-4">
            <div className="grid gap-2">
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-center text-xs font-bold text-slate-600">
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${barColors[color]}`}></span>
                  {detail}
                </div>
              ))}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className={`w-full py-4 rounded-xl text-white font-black text-sm transition-all shadow-lg active:scale-95 ${barColors[color]} hover:brightness-110`}
            >
              Перейти к разделу
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-center border-t border-slate-50">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-500 transition-colors">
          {isExpanded ? 'Свернуть' : 'Подробнее'}
        </span>
      </div>
    </div>
  );
};

const ExpandableTopicCard: React.FC<{
  topic: Orphogram;
  index: number;
  isCompleted: boolean;
  buttonLabel: string;
  color: 'blue' | 'green';
  onAction: () => void;
}> = ({ topic, index, isCompleted, buttonLabel, color, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = {
    blue: {
      border: isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 hover:border-blue-400 shadow-slate-200/20',
      icon: isCompleted ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600',
      btn: 'bg-slate-900 hover:bg-black',
      text: 'text-slate-900'
    },
    green: {
      border: isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 hover:border-emerald-400 shadow-slate-200/20',
      icon: isCompleted ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600',
      btn: 'bg-slate-900 hover:bg-black',
      text: 'text-slate-900'
    }
  };

  const current = colors[color];

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${current.border} ${isOpen ? 'shadow-xl scale-[1.01]' : 'shadow-sm hover:shadow-md'}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-6 cursor-pointer select-none">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-4 text-sm transition-colors ${current.icon}`}>
            {isCompleted ? '✓' : index + 1}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{topic.title}</h4>
            {isCompleted && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">Пройдено</span>}
          </div>
        </div>
        <div className={`transition-transform duration-300 text-slate-300 ${isOpen ? 'rotate-180 text-slate-600' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </div>

      <div className={`expand-grid ${isOpen ? 'expanded' : ''}`}>
        <div className="expand-inner">
          <div className="px-6 pb-6 pt-2">
            <div className="p-5 bg-slate-50 rounded-xl mb-6 border border-slate-100">
               <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-4">{topic.content}</p>
               <div className="flex flex-wrap gap-2">
                 {topic.examples.slice(0, 3).map((ex, i) => (
                   <span key={i} className="bg-white px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-100 shadow-sm">{ex}</span>
                 ))}
               </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onAction(); }}
              className={`w-full py-4 rounded-xl text-white font-black text-sm transition-all shadow-lg active:scale-95 ${current.btn}`}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MnemonicCard: React.FC<{ mnemonic: any }> = ({ mnemonic }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.01] duration-500">
      <div className="p-10 bg-gradient-to-br from-purple-50/30 to-white flex-grow">
        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-6">Мнемоника</div>
        <h3 className="text-2xl font-black text-slate-900 mb-8 heading-font tracking-tight">{mnemonic.title}</h3>
        <div className="relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 rounded-full"></div>
          <p className="italic text-slate-800 whitespace-pre-wrap font-serif leading-relaxed text-xl pl-8">
            {mnemonic.poem}
          </p>
        </div>
      </div>
      
      {mnemonic.quiz && (
        <div className="bg-slate-50/50 p-10 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Блиц-проверка</p>
          <p className="text-lg font-bold text-slate-900 mb-6 leading-snug">{mnemonic.quiz.question}</p>
          <div className="grid gap-3">
            {mnemonic.quiz.options.map((opt: string, i: number) => {
              let btnClass = "text-left px-6 py-4 rounded-xl border-2 transition-all duration-300 font-bold text-sm ";
              if (!isAnswered) {
                btnClass += "bg-white border-slate-200 hover:border-purple-500 text-slate-700 hover:shadow-md";
              } else {
                if (i === mnemonic.quiz.correctAnswer) {
                  btnClass += "bg-emerald-500 border-emerald-600 text-white shadow-lg scale-[1.02]";
                } else if (i === selected) {
                  btnClass += "bg-red-500 border-red-600 text-white";
                } else {
                  btnClass += "bg-slate-100 border-slate-200 text-slate-300 opacity-50";
                }
              }
              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => { setSelected(i); setIsAnswered(true); }}
                  className={btnClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ArenaCard: React.FC<{ task: ArenaTask }> = ({ task }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [attempted, setAttempted] = useState(false);

  const words = task.sentence.split(' ');

  const check = () => {
    setAttempted(true);
    if (selectedWordIndex === null) {
      setIsCorrect(false);
      return;
    }

    const selectedWordRaw = words[selectedWordIndex].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
    const errorWordRaw = task.errorWord.toLowerCase();
    
    const isSelectionCorrect = selectedWordRaw === errorWordRaw;
    const isCorrectionCorrect = inputValue.toLowerCase().trim() === task.correctWord.toLowerCase();

    if (isSelectionCorrect && isCorrectionCorrect) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const reset = () => {
    setSelectedWordIndex(null);
    setInputValue('');
    setIsCorrect(null);
    setAttempted(false);
    setShowAnswer(false);
  };

  return (
    <div className={`glass-card p-10 md:p-14 rounded-[3rem] border transition-all duration-500 shadow-2xl relative overflow-hidden ${
      isCorrect ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-slate-100'
    }`}>
      {isCorrect && <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>}
      
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 mb-10">
          {words.map((word, idx) => {
            const isSelected = selectedWordIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => { setSelectedWordIndex(idx); setAttempted(false); setIsCorrect(null); }}
                disabled={isCorrect === true}
                className={`text-xl md:text-3xl font-black transition-all px-3 py-1 rounded-xl cursor-pointer ${
                  isSelected 
                    ? 'bg-red-500 text-white shadow-lg scale-110 -rotate-1' 
                    : 'text-slate-900 hover:bg-slate-100'
                }`}
              >
                {word}
              </button>
            )
          })}
        </div>
        
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          {selectedWordIndex === null ? 'Выберите слово с ошибкой' : 'Введите верное написание'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input 
          type="text" 
          placeholder={selectedWordIndex === null ? "..." : "Как правильно?"}
          value={inputValue}
          disabled={selectedWordIndex === null || isCorrect === true}
          onChange={(e) => { setInputValue(e.target.value); setIsCorrect(null); setAttempted(false); }}
          className={`flex-grow p-6 rounded-2xl border-2 transition-all font-black text-xl shadow-inner focus:outline-none ${
            isCorrect === true ? 'border-emerald-500 bg-emerald-50' : 
            (isCorrect === false && attempted) ? 'border-red-500 bg-red-50 animate-shake' : 
            (selectedWordIndex === null ? 'border-slate-50 bg-slate-50 opacity-40' : 'border-slate-100 focus:border-blue-500 bg-white')
          }`}
        />
        
        {isCorrect ? (
          <button onClick={reset} className="bg-blue-600 text-white px-8 py-6 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-lg active:scale-95 uppercase tracking-widest transition-all">
            Далее
          </button>
        ) : (
          <button onClick={check} disabled={selectedWordIndex === null} className={`px-10 py-6 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95 ${
            selectedWordIndex === null ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'
          }`}>
            ОК
          </button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <button onClick={() => setShowAnswer(!showAnswer)} className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${showAnswer ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
          <span className="text-lg">💡</span> {showAnswer ? 'Скрыть подсказку' : 'Нужна подсказка?'}
        </button>
        
        <div className="flex items-center gap-4 h-8">
          {attempted && isCorrect === false && <span className="text-red-500 font-black text-sm animate-bounce">Попробуйте еще раз</span>}
          {isCorrect === true && <span className="text-emerald-600 font-black text-sm flex items-center gap-2 animate-pulse">✨ Идеально!</span>}
        </div>
      </div>

      <div className={`expand-grid ${showAnswer ? 'expanded mt-10' : ''}`}>
        <div className="expand-inner">
          <div className="p-8 bg-blue-50/50 rounded-2xl text-blue-900 border border-blue-100/50">
            <p className="font-bold text-lg leading-relaxed">{task.hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
