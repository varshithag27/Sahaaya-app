import React from 'react';

// Minimal Modal component used by forms. Keeps styling inline to avoid adding new assets.
const Modal = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
			<div style={{ width: '100%', maxWidth: '560px', background: 'white', borderRadius: '16px', padding: '20px', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
					<h2 style={{ margin: 0, fontSize: '20px' }}>{title}</h2>
					<button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>✕</button>
				</div>
				<div>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;
