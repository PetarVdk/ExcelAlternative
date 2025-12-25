import React from 'react';
import { createRoot } from 'react-dom/client';
import AppSwitcher from './AppSwitcher.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppSwitcher />);
