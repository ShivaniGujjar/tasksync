import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';


Modal.setAppElement('#root');

const preDefinedLabels = [
  { text: 'Feature', color: '#6366F1' },
  { text: 'Bug', color: '#EF4444' },
  { text: 'Urgent', color: '#F59E0B' },
  { text: 'UI', color: '#10B981' },
];

const CardModal = ({ isOpen, onRequestClose, card, onSave, onDelete }) => {
  
  const [formData, setFormData] = useState({ title: '', description: '', labels: [], checklist: [] });
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        description: card.description || '',
        labels: card.labels || [],
        
        checklist: card.checklist || [],
      });
      setIsEditingDescription(false);
      setNewItemText(''); 
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(card._id, formData);
    onRequestClose();
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      onDelete(card._id);
      onRequestClose();
    }
  };

  const toggleLabel = (label) => {
    const isLabelPresent = formData.labels.some(l => l.text === label.text);
    const updatedLabels = isLabelPresent
      ? formData.labels.filter(l => l.text !== label.text)
      : [...formData.labels, label];
    setFormData(prev => ({ ...prev, labels: updatedLabels }));
  };
  
  
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = { text: newItemText, completed: false };
    setFormData(prev => ({ ...prev, checklist: [...prev.checklist, newItem] }));
    setNewItemText(''); 
  };

  const handleToggleItem = (index) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;
    setFormData(prev => ({ ...prev, checklist: updatedChecklist }));
  };
  
  const handleDeleteItem = (index) => {
    const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, checklist: updatedChecklist }));
  };

  // progress bar
  const completedCount = formData.checklist.filter(item => item.completed).length;
  const totalCount = formData.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  

  if (!card) return null;

  const customModalStyles = {
    content: {
      top: '50%', left: '50%', right: 'auto', bottom: 'auto',
      marginRight: '-50%', transform: 'translate(-50%, -50%)',
      width: '90%', maxWidth: '600px',
      maxHeight: '90vh', overflowY: 'auto', padding: '2rem',
      borderRadius: '0.5rem', border: 'none',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000 },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      contentLabel="Card Details"
    >
      <div className="flex justify-between items-start mb-2">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="text-2xl font-bold text-gray-900 border-transparent focus:border-gray-300 focus:ring-0 rounded-md -ml-2 py-1 w-full"
        />
        <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
      </div>

      <p className="text-sm text-gray-600 mb-6">In List <span className="font-semibold">{card.list?.title || '...'}</span></p>

      {formData.labels.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2">Labels</h3>
          <div className="flex flex-wrap gap-2">
            {formData.labels.map(label => (
              <span key={label.text} style={{ backgroundColor: label.color }} className="px-2 py-1 text-xs text-white rounded-full">
                {label.text}
              </span>
            ))}
          </div>
        </div>
      )}

      <h3 className="font-bold mb-2">Description</h3>
      {isEditingDescription ? (
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={() => setIsEditingDescription(false)}
          rows="4"
          placeholder="Add a more detailed description..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          autoFocus
        />
      ) : (
        <div
          onClick={() => setIsEditingDescription(true)}
          className={`whitespace-pre-wrap mb-6 p-3 rounded-md min-h-[80px] ${!formData.description ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer' : ''}`}
        >
          {formData.description || 'No description provided. Click to add one...'}
        </div>
      )}

      
      <div className="mt-6">
        <h3 className="font-bold mb-2">Checklist</h3>
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        <div className="space-y-2">
          {formData.checklist.map((item, index) => (
            <div key={index} className="flex items-center group">
              <input 
                type="checkbox" 
                checked={item.completed} 
                onChange={() => handleToggleItem(index)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={`ml-3 flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {item.text}
              </span>
              <button onClick={() => handleDeleteItem(index)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100">
                &times;
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddItem} className="mt-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add an item..."
            className="w-full text-sm border-gray-200 rounded-md p-2"
          />
        </form>
      </div>
      

      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <h4 className="font-semibold mb-2">Add to card</h4>
        <div className="space-y-2">
          <div>
            <h5 className="font-semibold text-sm mb-1 text-gray-600">Labels</h5>
            <div className="flex flex-wrap gap-2">
              {preDefinedLabels.map(label => (
                <button
                  key={label.text}
                  style={{ backgroundColor: label.color }}
                  onClick={() => toggleLabel(label)}
                  className="px-3 py-1 text-sm text-white rounded-md hover:opacity-80 flex items-center"
                >
                  {label.text}
                  {formData.labels.some(l => l.text === label.text) && <span className="ml-2 text-white">✓</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <h5 className="font-semibold text-sm mb-1 text-gray-600">Actions</h5>
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center p-2 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 font-semibold"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Delete Card
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
        <button onClick={onRequestClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
      </div>
    </Modal>
  );
};

export default CardModal;