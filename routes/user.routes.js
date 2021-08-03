const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const downloadController = require('../controllers/download.controller');
const colaborateController = require('../controllers/colaborate.controller');
const multer = require('multer');
const upload = multer();
//auth
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logOut);

//user DB
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
module.exports = router;

//upload 

//router.post('/upload', upload.single('file'), uploadController.uploadModel)

router.post('/upload', uploadController.uploadModel)
//download

router.post('/download', downloadController.downloadModel)

//colaborate

router.post('/colaborate/', colaborateController.colaborate)