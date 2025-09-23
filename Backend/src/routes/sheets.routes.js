import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { createFormSheet, checkFormSheet, connectExistingFormSheet } from '../controllers/sheets.controller.js'

const router = Router()

router.get('/check', verifyJWT, checkFormSheet)
router.post('/create', verifyJWT, createFormSheet)
router.post('/connect', verifyJWT, connectExistingFormSheet)

export default router