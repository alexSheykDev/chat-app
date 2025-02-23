const express = require('express');
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require('../Controllers/userController');

const router = express.Router();

router.post('/register', (req, res) => {
  registerUser(req, res);
});
router.post('/login', (req, res) => {
  loginUser(req, res);
});
router.get('/find/:userId', (req, res) => {
  findUser(req, res);
});
router.get('/', (req, res) => {
  getUsers(req, res);
});
/* router.put('/update/:userId', (req, res) => {
  updateUser(req, res);
}); */
module.exports = router;
