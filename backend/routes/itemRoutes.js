const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/itemController');

router.get('/', c.getItems);
router.get('/stats', c.getStats);
router.get('/:id', c.getItem);
router.post('/', protect, c.createItem);
router.put('/:id', protect, c.updateItem);
router.delete('/:id', protect, c.deleteItem);

module.exports = router;
