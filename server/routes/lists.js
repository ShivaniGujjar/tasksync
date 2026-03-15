const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const List = require('../models/List');
const Board = require('../models/Board');
const Card = require('../models/Card');


// Create a new list
router.post('/', auth, async (req, res) => {
  const { title, boardId } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ msg: 'Board not found' });

    const isOwner = board.user.toString() === req.user.id;
    const isMember = board.members.some(member => member.toString() === req.user.id);
    if (!isOwner && !isMember) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const newList = new List({ title, board: boardId, position: (await List.countDocuments({ board: boardId })) });
    const list = await newList.save();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get all lists for a board
router.get('/:boardId', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId);
        if (!board) return res.status(404).json({ msg: 'Board not found' });
        const isOwner = board.user.toString() === req.user.id;
        const isMember = board.members.some(member => member.toString() === req.user.id);
        if (!isOwner && !isMember) return res.status(401).json({ msg: 'Not authorized' });

        const lists = await List.find({ board: req.params.boardId }).sort({ position: 'asc' });
        res.json(lists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Reorder lists
router.put('/reorder', auth, async (req, res) => {
  const { lists, boardId } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ msg: 'Board not found' });
    
    const isOwner = board.user.toString() === req.user.id;
    const isMember = board.members.some(member => member.toString() === req.user.id);
    if (!isOwner && !isMember) {
        return res.status(401).json({ msg: 'Not authorized to reorder lists' });
    }

    await Promise.all(
      lists.map((list, index) =>
        List.findByIdAndUpdate(list._id, { position: index })
      )
    );
    res.json({ msg: 'Lists reordered successfully' });
  } catch (err) {
    console.error("Error in /api/lists/reorder:", err.message);
    res.status(500).send('Server Error');
  }
});


// Update a list's title
router.put('/:id', auth, async (req, res) => {
    try {
        const { title } = req.body;
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ msg: 'List not found' });

        const board = await Board.findById(list.board);
        if (!board) return res.status(404).json({ msg: 'Board not found' });
        
        const isOwner = board.user.toString() === req.user.id;
        const isMember = board.members.some(member => member.toString() === req.user.id);
        if (!isOwner && !isMember) {
            return res.status(401).json({ msg: 'Not authorized to edit this list' });
        }

        list.title = title;
        await list.save();
        res.json(list);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Delete a list (Owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ msg: 'List not found' });

        const board = await Board.findById(list.board);
        if (board.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Only the board owner can delete lists' });
        }

        await Card.deleteMany({ list: req.params.id });
        await list.deleteOne();
        res.json({ msg: 'List removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;