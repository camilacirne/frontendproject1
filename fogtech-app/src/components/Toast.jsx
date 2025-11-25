import { useEffect } from 'react';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      zIndex: 1000,
      fontWeight: 500,
      maxWidth: '300px',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      {message}
    </div>
  );
}

export default Toast;