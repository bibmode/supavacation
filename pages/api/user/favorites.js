import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  // TODO: Check if user is authenticated
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // TODO: Get user favorites
  if (req.method === "GET") {
    try {
      const homes = await prisma.user.findMany({
        where: { email: session.user.email },
        select: { favoriteHomes: true },
      });

      res.status(200).json(homes);
    } catch (error) {
      res.status(500).json({ message: "Can't get user favorites" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
