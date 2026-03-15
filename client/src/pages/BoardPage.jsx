import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CardModal from '../components/CardModal';
import BoardSettingsModal from '../components/BoardSettingsModal';
import { EditIcon, DeleteIcon } from '../components/Icons';
import { setBoardData, clearBoardData } from '../features/board/boardSlice';

const MemberAvatar = ({ name, onRemove, showRemoveButton }) => (
    <div className="relative group">
      <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm border-2 border-white" title={name}>
        {name ? name.charAt(0).toUpperCase() : '?'}
      </div>
      {showRemoveButton && (
        <button onClick={onRemove} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity" title={`Remove ${name}`}>
          &times;
        </button>
      )}
    </div>
);

const formatDeadline = (deadline) => {
  if (!deadline) return null;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  deadlineDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let text = `Due ${deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  let bgColor = 'bg-blue-100';
  let textColor = 'text-blue-800';
  let iconColor = 'text-blue-500';
  if (diffDays < 0) {
    text = `Overdue`; bgColor = 'bg-red-500'; textColor = 'text-white'; iconColor = 'text-white';
  } else if (diffDays === 0) {
    text = 'Due Today'; bgColor = 'bg-orange-400'; textColor = 'text-white'; iconColor = 'text-white';
  } else if (diffDays <= 7) {
    text = `Due in ${diffDays} days`; bgColor = 'bg-yellow-300'; textColor = 'text-yellow-900'; iconColor = 'text-yellow-700';
  }
  return (
    <div className={`mt-2 flex items-center text-sm font-semibold px-3 py-1.5 rounded-full shadow-md ${bgColor} ${textColor}`}>
      <svg className={`w-4 h-4 mr-1.5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {text}
    </div>
  );
};

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [listTitle, setListTitle] = useState('');
  const [cardTitles, setCardTitles] = useState({});
  const [memberEmail, setMemberEmail] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const fetchBoardData = async () => {
    if (!token) return;
    const config = { headers: { 'x-auth-token': token } };
    try {
      const boardRes = await axios.get(`http://localhost:5001/api/boards/${boardId}`, config);
      setBoard(boardRes.data);
      dispatch(setBoardData(boardRes.data));
      const listsRes = await axios.get(`http://localhost:5001/api/lists/${boardId}`, config);
      setLists(listsRes.data.sort((a, b) => a.position - b.position));
      const cardsData = {};
      for (const list of listsRes.data) {
        const cardsRes = await axios.get(`http://localhost:5001/api/cards/${list._id}`, config);
        cardsData[list._id] = cardsRes.data.map(card => ({...card, list: {title: list.title}}));
      }
      setCards(cardsData);
    } catch (err) { console.error('Failed to fetch data', err); }
  };

  useEffect(() => {
    fetchBoardData();
    return () => {
      dispatch(clearBoardData());
    };
  }, [boardId, token, dispatch]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (type === 'list') { 
      const reorderedLists = Array.from(lists); 
      const [movedList] = reorderedLists.splice(source.index, 1); 
      reorderedLists.splice(destination.index, 0, movedList); 
      setLists(reorderedLists); 
      setHasChanges(true);
      return; 
    }
    const sourceListId = source.droppableId; 
    const destListId = destination.droppableId;
    if (sourceListId === destListId) { 
      const listCards = Array.from(cards[sourceListId]); 
      const [movedCard] = listCards.splice(source.index, 1); 
      listCards.splice(destination.index, 0, movedCard); 
      setCards({ ...cards, [sourceListId]: listCards }); 
      return; 
    }
    const sourceCards = Array.from(cards[sourceListId]); 
    const [movedCard] = sourceCards.splice(source.index, 1); 
    const destCards = Array.from(cards[destListId] || []); 
    destCards.splice(destination.index, 0, movedCard); 
    setCards({ ...cards, [sourceListId]: sourceCards, [destListId]: destCards });
    try { 
      const config = { headers: { 'x-auth-token': token } }; 
      await axios.put(`http://localhost:5001/api/cards/${draggableId}/move`, { newListId: destListId }, config); 
    } catch (err) { 
      console.error('Failed to move card', err); 
    }
  };
  
  
  const handleSaveOrder = async () => { 
    try { 
      const config = { headers: { 'x-auth-token': token } }; 
      await axios.put(`http://localhost:5001/api/lists/reorder`, { lists, boardId }, config); 
      setHasChanges(false); 
      alert('Order saved!'); 
    } catch (err) { 
      console.error('Failed to reorder lists', err); 
      alert('Failed to save order.'); 
    } 
  };
  
  const onListSubmit = async (e) => { e.preventDefault(); if(!listTitle.trim()) return; try { const config = { headers: { 'x-auth-token': token } }; const body = { title: listTitle, boardId: boardId }; const res = await axios.post('http://localhost:5001/api/lists', body, config); setLists([...lists, res.data]); setListTitle(''); setIsAddingList(false); } catch (err) { console.error('Failed to create list', err); } };
  const onCardSubmit = async (e, listId) => { e.preventDefault(); const title = cardTitles[listId]; if (!title || !title.trim()) return; try { const config = { headers: { 'x-auth-token': token } }; const body = { title, listId, boardId }; const res = await axios.post(`http://localhost:5001/api/cards`, body, config); const list = lists.find(l => l._id === listId); setCards({ ...cards, [listId]: [...(cards[listId] || []), {...res.data, list: {title: list.title}}] }); setCardTitles({ ...cardTitles, [listId]: '' }); } catch (err) { console.error('Failed to create card', err); } };
  const handleCardTitleChange = (e, listId) => { setCardTitles({ ...cardTitles, [listId]: e.target.value }); };
  
  const onMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post(`http://localhost:5001/api/boards/${board._id}/members`, { email: memberEmail }, config);
      setBoard(res.data);
      setMemberEmail('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to add member.');
    }
  };
  
  const handleSettingsUpdate = async (updatedData) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put(`http://localhost:5001/api/boards/${board._id}`, updatedData, config);
      setBoard(res.data);
      dispatch(setBoardData(res.data));
    } catch (err) {
      alert('Error: Could not save board settings.');
    }
  };

  const openModal = (card) => { setSelectedCard(card); setModalIsOpen(true); };
  const closeModal = () => { setModalIsOpen(false); setSelectedCard(null); };
  const handleListDelete = async (listId) => { if (window.confirm('Are you sure?')) { try { const config = { headers: { 'x-auth-token': token } }; await axios.delete(`http://localhost:5001/api/lists/${listId}`, config); setLists((prevLists) => prevLists.filter((list) => list._id !== listId)); setCards((prevCards) => { const newCards = { ...prevCards }; delete newCards[listId]; return newCards; }); } catch (err) { console.error('Failed to delete list', err); } } };
  const handleCardUpdate = async (cardId, updatedData) => { try { const config = { headers: { 'x-auth-token': token } }; const res = await axios.put(`http://localhost:5001/api/cards/${cardId}`, updatedData, config); const updatedCard = res.data; const listId = updatedCard.list; setCards(prevCards => ({ ...prevCards, [listId]: prevCards[listId].map(card => card._id === cardId ? { ...card, ...updatedCard, list: card.list } : card), })); } catch (err) { console.error('Failed to update card', err); } };
  const startListEdit = (list) => { setEditingListId(list._id); setEditingListTitle(list.title); };
  const handleListTitleUpdate = async (e, listId) => { e.preventDefault(); try { const config = { headers: { 'x-auth-token': token } }; const res = await axios.put(`http://localhost:5001/api/lists/${listId}`, { title: editingListTitle }, config); setLists(lists.map(list => list._id === listId ? res.data : list)); setEditingListId(null); } catch (err) { console.error('Failed to update list title', err); } };
  
  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.delete(`http://localhost:5001/api/boards/${board._id}/members/${memberId}`, config);
        setBoard(res.data);
        dispatch(setBoardData(res.data));
      } catch (err) {
        alert('Could not remove member.');
      }
    }
  };

  const handleCardDelete = async (cardId) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.delete(`http://localhost:5001/api/cards/${cardId}`, config);
      const { listId } = res.data;
      setCards(prevCards => {
        const newCardsInList = prevCards[listId].filter(card => card._id !== cardId);
        return { ...prevCards, [listId]: newCardsInList };
      });
    } catch (err) {
      alert('Could not delete the card.');
    }
  };

  if (!board || !user) return <div className="p-8">Loading...</div>;

  return (
    <>
      <div style={{ backgroundColor: board.background }} className="p-4 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-400">
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-extrabold text-gray-900">{board.title}</h1>
                <div className="flex -space-x-3">
                  {board.user && <MemberAvatar name={board.user.name} showRemoveButton={false} />}
                  {board.members && board.members.map(member => (
                    <MemberAvatar 
                      key={member._id} 
                      name={member.name} 
                      onRemove={() => handleRemoveMember(member._id)}
                      showRemoveButton={user._id === board.user._id}
                    />
                  ))}
                </div>
              </div>
              {formatDeadline(board.deadline)} 
            </div>
            
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <button 
                  onClick={handleSaveOrder} 
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Save Order
                </button>
              )}

              {user && board.user && user._id === board.user._id && (
                <>
                  <form onSubmit={onMemberSubmit} className="flex">
                    <input type="email" className="px-3 py-2 border rounded-md shadow-sm text-sm" placeholder="Invite by email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required />
                    <button type="submit" className="ml-2 px-4 py-2 border text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">+ Add</button>
                  </form>
                  <button onClick={() => setSettingsModalIsOpen(true)} className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Board Settings
                  </button>
                </>
              )}
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-lists" direction="horizontal" type="list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex items-stretch gap-6 overflow-x-auto pb-4 flex-grow scrollbar-hide">
                  {lists.map((list, index) => (
                    <Draggable key={list._id} draggableId={list._id} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} ref={provided.innerRef} className="bg-white rounded-xl shadow-sm w-80 flex-shrink-0 flex flex-col">
                          <div {...provided.dragHandleProps} className="relative flex justify-center items-center p-4 bg-indigo-600 rounded-t-xl">
                            <div className="w-full text-center">
                              {editingListId === list._id ? (
                                <form onSubmit={(e) => handleListTitleUpdate(e, list._id)} className="w-full">
                                  <input type="text" value={editingListTitle} onChange={(e) => setEditingListTitle(e.target.value)} 
                                  className="w-full font-bold text-lg bg-indigo-700 text-white border-indigo-400 rounded px-2 text-center" 
                                  autoFocus onBlur={(e) => handleListTitleUpdate(e, list._id)} />
                                </form>
                              ) : (
                                <h2 className="font-bold text-lg text-white truncate px-8">{list.title}</h2>
                              )}
                            </div>
                            <div className="absolute right-4 flex items-center">
                              <button onClick={() => startListEdit(list)} className="text-indigo-200 hover:text-white"><EditIcon /></button>
                              <button onClick={() => handleListDelete(list._id)} className="text-indigo-200 hover:text-white ml-2"><DeleteIcon /></button>
                            </div>
                          </div>
                          <div className="p-4 flex-grow bg-gray-100">
                            <Droppable droppableId={list._id} type="card">
                              {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[50px] flex-grow">
                                  {cards[list._id] && cards[list._id].map((card, index) => {
                                    const totalItems = card.checklist ? card.checklist.length : 0;
                                    const completedItems = totalItems > 0 ? card.checklist.filter(item => item.completed).length : 0;
                                    const allCompleted = totalItems > 0 && completedItems === totalItems;
                                    return (
                                      <Draggable key={card._id} draggableId={card._id} index={index}>
                                        {(provided) => (
                                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                                            className="bg-white p-3 pb-8 rounded-lg border hover:border-indigo-500 cursor-pointer relative" 
                                            onClick={() => openModal(card)}>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                              {card.labels && card.labels.map(label => (
                                                <span key={label.text} style={{ backgroundColor: label.color }} className="h-2 w-10 rounded-full"></span>
                                              ))}
                                            </div>
                                            <p className="font-medium text-gray-800">{card.title}</p>
                                            {totalItems > 0 && (
                                              <div className={`absolute bottom-2 right-2 flex items-center text-xs font-semibold px-2 py-1 rounded-md ${
                                                  allCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                                              }`}>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {completedItems}/{totalItems}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                          <div className="p-4 pt-2 bg-gray-100 rounded-b-xl">
                              <form onSubmit={(e) => onCardSubmit(e, list._id)} className="mt-auto">
                                <input type="text" className="w-full px-3 py-2 border rounded-md shadow-sm text-sm" 
                                  placeholder="+ Add a card" value={cardTitles[list._id] || ''} onChange={(e) => handleCardTitleChange(e, list._id)} />
                              </form>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  <div className="w-80 flex-shrink-0">
                    {isAddingList ? (
                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        <form onSubmit={onListSubmit}>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                            placeholder="Enter list title..." value={listTitle} onChange={(e) => setListTitle(e.target.value)} required autoFocus />
                          <div className="mt-3 flex justify-center items-center gap-2">
                            <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold text-sm">
                              Add List
                            </button>
                            <button type="button" onClick={() => setIsAddingList(false)} className="text-2xl text-gray-500 hover:text-gray-800">
                              &times;
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <button onClick={() => setIsAddingList(true)} 
                        className="w-full h-12 text-left text-indigo-800 font-semibold bg-indigo-100/50 hover:bg-indigo-100/80 p-3 rounded-xl transition-colors flex items-center">
                        <span className="text-xl mr-2">+</span> Add another list
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <CardModal isOpen={modalIsOpen} onRequestClose={closeModal} card={selectedCard} 
        onSave={handleCardUpdate} onDelete={handleCardDelete} />
      {board && (
        <BoardSettingsModal isOpen={settingsModalIsOpen} onRequestClose={() => setSettingsModalIsOpen(false)} 
          board={board} onUpdate={handleSettingsUpdate} />
      )}
    </>
  );
};

export default BoardPage;