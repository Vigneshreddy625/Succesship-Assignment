import { Router } from 'express'
import { getCurrentUser, logout, register, login, refresh } from '../controllers/auth.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { handleGoogleOAuthCallback, startGoogleOAuth, getFormGoogleAccounts } from '../controllers/oauth.controller.js'

const router = Router()

router.get("/google", startGoogleOAuth); 
router.get("/google/callback", handleGoogleOAuthCallback);
router.get('/google/accounts/:formId', verifyJWT, getFormGoogleAccounts)

router.get('/me', verifyJWT, getCurrentUser)

router.post('/logout', logout)

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)

router.get('/google/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'Google authentication failed' })
})

export default router


