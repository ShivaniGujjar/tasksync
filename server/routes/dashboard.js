const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');


// Get user's dashboard stats 
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[1/5] Dashboard route started for user: ${userId}`);

    const userBoardsFilter = { $or: [{ user: userId }, { members: userId }] };

    console.log('[2/5] Starting parallel queries for boards...');
    const [
      totalBoards,
      recentBoards,
      allUserBoardIds
    ] = await Promise.all([
      Board.countDocuments(userBoardsFilter),
      Board.find(userBoardsFilter).sort({ createdAt: -1 }).limit(4).select('title background members'),
      Board.find(userBoardsFilter).select('_id')
    ]);
    console.log(`[3/5] Board queries finished. Found ${totalBoards} total boards.`);

    const boardIds = allUserBoardIds.map(b => b._id);

    console.log('[4/5] Starting parallel queries for lists and cards...');
    const [
      totalLists,
      totalCards
    ] = await Promise.all([
        List.countDocuments({ board: { $in: boardIds } }),
        Card.countDocuments({ board: { $in: boardIds } })
    ]);
    console.log(`[5/5] List/Card queries finished. Found ${totalLists} lists and ${totalCards} cards.`);

    const recentBoardsWithMemberCount = recentBoards.map(board => ({
        _id: board._id,
        title: board.title,
        background: board.background,
        memberCount: 1 + (board.members ? board.members.length : 0)
    }));
    
    console.log('Successfully compiled all data. Sending response...');
    res.json({
      totalBoards,
      totalLists,
      totalCards,
      recentBoards: recentBoardsWithMemberCount,
    });

  } catch (err) {
    console.error('---!!! ERROR IN DASHBOARD ROUTE !!!---');
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;