import React, { useState } from 'react';
import { Switch, DollarSign, Instagram, CalendarDays } from 'lucide-react';
import FinanceInventoryApp from './App.jsx';
import InstagramAnalytics from './InstagramAnalytics.jsx';
import ContentPlanner from './ContentPlanner.jsx';
import './App.css';

const AppSwitcher = () => {
  const [currentApp, setCurrentApp] = useState('profit'); // 'profit', 'instagram', or 'content'
  const [isAnimating, setIsAnimating] = useState(false);


  const switchApp = (newApp) => {
    if (newApp === currentApp || isAnimating) return;
    
    setIsAnimating(true);
    
    // Animation duration
    setTimeout(() => {
      setCurrentApp(newApp);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const switcherProps = {
    currentApp,
    switchApp,
    isAnimating
  };

  return (
    <div className={`app-switcher ${isAnimating ? 'animating' : ''}`}>
      {/* App Content with Animation */}
      <div className={`app-content-wrapper ${currentApp === 'profit' ? 'show-profit' : currentApp === 'instagram' ? 'show-instagram' : 'show-content'}`}>
        <div className="app-content profit-app">
          {currentApp === 'profit' && <FinanceInventoryApp switcherProps={switcherProps} />}
        </div>
        <div className="app-content instagram-app">
          {currentApp === 'instagram' && <InstagramAnalytics switcherProps={switcherProps} />}
        </div>
        <div className="app-content content-app">
          {currentApp === 'content' && <ContentPlanner switcherProps={switcherProps} />}
        </div>
      </div>
    </div>
  );
};

export default AppSwitcher;

