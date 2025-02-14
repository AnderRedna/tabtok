import React from 'react';
import { Home, Search, PlusSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  
  const handleNavClick = (e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    alert(`A funcionalidade de ${feature} estará disponível em breve!`);
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Home', enabled: true },
    { icon: Search, path: '/search', label: 'Buscar', enabled: false },
    { icon: PlusSquare, path: '/create', label: 'Criar', enabled: false },
    { icon: User, path: '/profile', label: 'Perfil', enabled: true }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map(({ icon: Icon, path, label, enabled }) => (
          <Link
            key={path}
            to={path}
            onClick={(e) => !enabled && handleNavClick(e, label.toLowerCase())}
            className={`flex flex-col items-center p-2 ${
              location.pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
            } ${!enabled && 'opacity-50'}`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}