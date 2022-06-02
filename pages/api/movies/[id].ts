import widthHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { ResponseType } from "@types.ts";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const { id } = req.query;

        const movie = await client.movie.findUnique({
            where: { id: +id },
            include: {
                actors: true,
                crews: true,
                genres: true,
            },
        });

        return res.json({ ok: true, movie });
    }
}

export default widthHandler({ methods: ["GET"], handler });
