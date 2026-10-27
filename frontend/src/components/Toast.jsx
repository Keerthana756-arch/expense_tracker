import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type, message, title } = toast;

  let Icon = CheckCircle2;
  let toastClass = 'toast-success';

  if (type === 'error') {
    Icon = AlertCircle;
    toastClass = 'toast-error';
  } else if (type === 'info') {
    Icon = Info;
    toastClass = 'toast-info';
  }

  return (
    <div className={`toast-container ${toastClass}`} role="alert">
      <div className="toast-icon">
        <Icon size={20} />
      </div>
      <div className="toast-body">
        {title && <h5 className="toast-title">{title}</h5>}
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}

