import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  // TODO: Check if user is authenticated
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // TODO: Retrieve home ID from request
  const { id: homeId } = req.query;

  // TODO: Add home to favorite
  if (req.method === "PUT") {
    try {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          favoriteHomes: {
            connect: [{ id: homeId }],
          },
        },
      });

      res.status(200).json({ message: "Added to favorite" });
    } catch (error) {
      res.status(500).json({ message: "Addition failed" });
    }
  }
  // TODO: Remove home from favorite
  else if (req.method === "DELETE") {
    try {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          favoriteHomes: {
            disconnect: [{ id: homeId }],
          },
        },
      });

      res.status(200).json({ message: "Deleted from favorite" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
