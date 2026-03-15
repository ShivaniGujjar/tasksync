import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


Modal.setAppElement('#root');

const COLORS = [
  '#FFFFFF', // Classic White
  '#F3F4F6', // Light Gray
  '#BAE6FD', // Sky Blue
  '#A7F3D0', // Mint Green
  '#DDD6FE', // Lavender (matches your theme)
  '#FED7AA', // Peach
  '#FBCFE8', // Light Pink
  '#6c9ad9', // Dark Slate
];

const BoardSettingsModal = ({ isOpen, onRequestClose, board, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('');
  
  const [deadline, setDeadline] = useState(null);

  
  useEffect(() => {
    if (board) {
      setTitle(board.title || '');
      setBackground(board.background || '#FFFFFF');
      
      setDeadline(board.deadline ? new Date(board.deadline) : null);
    }
  }, [board]);

  const handleSave = () => {
    
    onUpdate({ title, background, deadline });
    onRequestClose();
  };

  if (!board) return null;

  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '450px',
      padding: '2rem',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1000,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      contentLabel="Board Settings"
    >
      <h2 className="text-xl font-bold text-center mb-6">Board Settings</h2>

      <div className="space-y-6">
        {/* Board Title*/}
        <div>
          <label htmlFor="boardTitle" className="block text-sm font-semibold text-gray-700 mb-1">
            Board Title
          </label>
          <input
            id="boardTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/*DEADLINE PICKER SECTION */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-1">
            Project Deadline
          </label>
          <input
  type="date"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
  
  value={deadline ? new Date(deadline).toISOString().split('T')[0] : ''}
  
  onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : null)}
/>
        </div>
        

        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setBackground(color)}
                className={`w-full h-12 rounded-md border-2 transition-transform transform hover:scale-110 ${
                  background === color ? 'border-indigo-600 ring-2 ring-offset-2 ring-indigo-500' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Set background color to ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
        <button onClick={onRequestClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default BoardSettingsModal;