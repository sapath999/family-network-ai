import React from 'react';
import { Home, Info, Users } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'agents', label: 'Agents', icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center py-6 px-4 pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl pointer-events-auto flex items-center gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              relative px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 font-medium text-sm
              ${currentView === item.id 
                ? 'text-white bg-white/10 shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
            {currentView === item.id && (
              <span className="absolute inset-0 rounded-full border border-white/20" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;