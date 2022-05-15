import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { Movie } from "@prisma/client";

// 한 페이지(skip) 당 영화 개수
const take = 5;

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const { page } = req.query;
        let movies: Movie[];
        if (page && Number(page) !== NaN) {
            movies = await client.movie.findMany({ take, skip: Number(page) });
        } else {
            movies = await client.movie.findMany({ take, skip: 1 });
        }
        return res.json({ ok: true, movies });
    }
}

export default widthHandler({ methods: ["GET"], handler });
