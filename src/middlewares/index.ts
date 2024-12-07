import express from "express";

import { get, identity, merge } from "lodash";

import { getUserBySessionToken } from "../db/user";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string | undefined;

    console.log("current user: ", currentUserId);

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({
        message: "You are not authorized!",
      });
      //   return res.sendStatus(403);
    }
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const sessionToken = req.cookies["bolu-auth"];

    if (!sessionToken) {
      return res.status(403).json({
        status: "failed",
        message: "You are not authenticated to perform this action my boss!",
      });
      //   return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
