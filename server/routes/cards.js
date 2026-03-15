const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Card = require('../models/Card');
const List = require('../models/List');
const Board = require('../models/Board');


// Create a new card in a list
router.post('/', auth, async (req, res) => {
  try {
    const { title, listId, boardId, description, labels } = req.body;

    const board = await Board.findById(boardId);
    if (!board || (board.user.toString() !== req.user.id && !board.members.includes(req.user.id))) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const newCard = new Card({
      title,
      list: listId,
      board: boardId,
      description: description || '',
      labels: labels || [],
    });

    const card = await newCard.save();
    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get all cards for a list
router.get('/:listId', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    const board = await Board.findById(list.board);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    const isOwner = board.user.toString() === req.user.id;
    const isMember = board.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const cards = await Card.find({ list: req.params.listId });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Move a card to a new list
router.put('/:cardId/move', auth, async (req, res) => {
  try {
    const { newListId } = req.body;
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: 'Card not found' });
    }
    
    card.list = newListId;
    await card.save();
    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Update a card's details
router.put('/:id', auth, async (req, res) => {
  try {
    
    const { title, description, labels, dueDate, checklist } = req.body;
    
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ msg: 'Card not found' });

    const board = await Board.findById(card.board);
    const isOwner = board.user.toString() === req.user.id;
    const isMember = board.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    
    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (dueDate !== undefined) updatedFields.dueDate = dueDate;
    if (labels !== undefined) updatedFields.labels = labels;
    
    if (checklist !== undefined) updatedFields.checklist = checklist;

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    res.json(updatedCard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Delete a card
router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    const board = await Board.findById(card.board);
    const isOwner = board.user.toString() === req.user.id;
    const isMember = board.members.some(member => member.toString() === req.user.id);
    if (!isOwner && !isMember) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await card.deleteOne();

    res.json({ 
      msg: 'Card removed', 
      cardId: req.params.id, 
      listId: card.list 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;