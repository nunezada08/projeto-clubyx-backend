import express from 'express';
import * as controller from '../controllers/usuarioFotoController.js';
import { uploads } from '../utils/fotoHelper.js';

const router = express.Router();

router.post('/:id/foto', uploads.single('foto'), controller.uploadFoto);
router.get('/:id/foto', controller.verFoto);

export default router;
