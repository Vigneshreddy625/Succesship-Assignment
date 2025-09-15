  import { Router } from 'express';
  import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessToken,
    deleteUser,
    userDetails,
  } from '../controllers/user.controller.js';
  import { verifyJWT } from '../middlewares/auth.middleware.js';

  const router = Router();

  router.route("/register").post(registerUser);
  router.route("/login").post(loginUser);
  router.route("/refresh-token").post(refreshAccessToken);
  router.route("/update-details").patch(verifyJWT,userDetails);
  router.route("/current-user").get(verifyJWT,getCurrentUser);
  router.route("/logout").post(verifyJWT, logoutUser);
  router.route("/delete-user/:id").delete(deleteUser);

  export default router;