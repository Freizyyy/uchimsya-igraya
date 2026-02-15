
import React from 'react';
import { Section } from '../types';

interface NavigationProps {
  currentSection: Section;
  setSection: (s: Section) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, setSection }) => {
  const navItems = [
    { id: Section.HOME, label: 'Главная' },
    { id: Section.THEORY, label: 'Теория' },
    { id: Section.MNEMONICS, label: 'Стихи' },
    { id: Section.PRACTICE, label: 'Тренажер' },
    { id: Section.ARENA, label: 'Арена' },
    { id: Section.FINAL_TEST, label: 'Итоговый' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 pointer-events-none">
      <div className="max-w-5xl mx-auto glass-card rounded-2xl shadow-xl shadow-slate-200/50 pointer-events-auto border border-white/40">
        <div className="flex justify-between items-center h-14 px-4 md:px-6">
          <div className="flex items-center">
            <span 
              className="text-lg md:text-xl font-black text-blue-600 cursor-pointer heading-font tracking-tighter"
              onClick={() => setSection(Section.HOME)}
            >
              УЧИМСЯ<span className="text-slate-800">ИГРАЯ</span>
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl group ${
                    isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Selector */}
          <div className="md:hidden flex items-center">
            <select 
              value={currentSection}
              onChange={(e) => setSection(e.target.value as Section)}
              className="bg-white/50 border-none text-slate-900 text-xs font-bold rounded-lg focus:ring-0 block w-full py-1.5 px-3 outline-none cursor-pointer"
            >
              {navItems.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
