import express from "express";

import {
  createUserRequest,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
  deleteUserRequest,
  refreshEmailToken,
  getFriendRequests,
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  addMatchToUser,
  updateEmailRequest,
  handleGetMatchHistory,
} from "../controller/user-controller.js";
import { verifyAccessToken, verifyEmailToken, verifyIsAdmin, verifyIsOwnerOrAdmin } from "../middleware/basic-access-control.js";

const router = express.Router();

router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.get("/:id/friendRequests", verifyAccessToken, verifyIsOwnerOrAdmin, getFriendRequests);

router.get("/:id/friends", verifyAccessToken, verifyIsOwnerOrAdmin, getFriends);

router.post("/:id/addFriend", verifyAccessToken, verifyIsOwnerOrAdmin, sendFriendRequest);

router.post("/:id/acceptFriend", verifyAccessToken, verifyIsOwnerOrAdmin, acceptFriendRequest);

router.post("/:id/addMatch", verifyAccessToken, verifyIsOwnerOrAdmin, addMatchToUser);

router.patch("/:id/privilege", verifyAccessToken, verifyIsAdmin, updateUserPrivilege);

router.post("/", createUserRequest);

router.patch("/:id/resend-request", verifyEmailToken, refreshEmailToken);

router.delete("/:email/request", deleteUserRequest);

router.get("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, getUser);

router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

router.post("/:id/email-update-request", verifyAccessToken, verifyIsOwnerOrAdmin, updateEmailRequest);

router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);

router.get("/:id/match-history", verifyAccessToken, handleGetMatchHistory)

export default router;