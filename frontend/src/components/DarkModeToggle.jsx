import { useState } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="dark-toggle" onClick={toggleDarkMode}>
      <input type="checkbox" checked={isDark} readOnly />
      <div className="slider">
        <div className="slider:before"></div>
      </div>
    </div>
  );
}
