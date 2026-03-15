const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');
const User = require('../models/User');


// Create a new board and its default lists
router.post('/', auth, async (req, res) => {
  try {
    const { title, background } = req.body;
    const newBoard = new Board({
      title,
      background: background || '#FFFFFF',
      user: req.user.id,
    });
    const board = await newBoard.save();
    const defaultLists = [
      { title: 'To Do', board: board._id, position: 0 },
      { title: 'In Progress', board: board._id, position: 1 },
      { title: 'Done', board: board._id, position: 2 },
    ];
    await List.insertMany(defaultLists);
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get all boards for a user
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ user: req.user.id }, { members: req.user.id }],
    }).sort({ createdAt: -1 });
    
    const boardsResponse = boards.map(board => ({
        _id: board._id,
        title: board.title,
        background: board.background,
        user: board.user,
        memberCount: 1 + (board.members ? board.members.length : 0)
    }));
    res.json(boardsResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get a single board by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('user', 'name email').populate('members', 'name email');
    if (!board) return res.status(404).json({ msg: 'Board not found' });
    const isOwner = board.user._id.toString() === req.user.id;
    const isMember = board.members.some(member => member._id.toString() === req.user.id);
    if (!isOwner && !isMember) return res.status(401).json({ msg: 'Not authorized' });
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Update a board's settings
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, background, deadline } = req.body;
    let board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ msg: 'Board not found' });
    if (board.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (background) updatedFields.background = background;
    if (deadline !== undefined) updatedFields.deadline = deadline;
    board = await Board.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true })
      .populate('user', 'name email').populate('members', 'name email');
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Add a member to a board
router.post('/:id/members', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        const userToAdd = await User.findOne({ email: req.body.email });
        if (!userToAdd) return res.status(404).json({ msg: 'User not found' });
        if (!board) return res.status(404).json({ msg: 'Board not found' });
        if (board.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        if (board.members.includes(userToAdd.id) || board.user.equals(userToAdd.id)) return res.status(400).json({ msg: 'User is already a member' });
        board.members.push(userToAdd.id);
        await board.save();
        const updatedBoard = await Board.findById(req.params.id).populate('user', 'name email').populate('members', 'name email');
        res.json(updatedBoard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Remove a member from a board
router.delete('/:id/members/:memberId', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ msg: 'Board not found' });
        if (board.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        const removeIndex = board.members.map(member => member.toString()).indexOf(req.params.memberId);
        if (removeIndex === -1) return res.status(404).json({ msg: 'Member not found' });
        board.members.splice(removeIndex, 1);
        await board.save();
        const updatedBoard = await Board.findById(req.params.id).populate('user', 'name email').populate('members', 'name email');
        res.json(updatedBoard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Delete a board and all its content
router.delete('/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ msg: 'Board not found' });
        if (board.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        await List.deleteMany({ board: req.params.id });
        await Card.deleteMany({ board: req.params.id });
        await board.deleteOne();
        res.json({ msg: 'Board removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

