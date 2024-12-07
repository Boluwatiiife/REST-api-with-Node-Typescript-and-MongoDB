import express from "express";
import { isAuthenticated } from "../middlewares";
import { deleteUserById, getUserById, getUsers } from "../db/user";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
): Promise<any> => {
  try {
    // const partcularUser = (req as any).existingUser;
    const users = await getUsers();

    return res.status(200).json({
      total_users: users.length,
      //   Note: `You, ${partcularUser.username} are the one viewing this list`,
      users,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ error: error.message });
    // return res.sendStatus(400).json(error);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);
    return res.json({ deleted_user: deletedUser });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(403).json({ message: "Username is required!" });
      // return res.sendStatus(403)
    }
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.username = username;
    await user.save();

    return res.status(200).json({
      updateed_user: user,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};
