import widthHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { ResponseType } from "@types.ts";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const { q } = req.query;
        const movies = await (q
            ? client.movie.findMany({
                  where: {
                      OR: [
                          {
                              title: {
                                  contains: q + "",
                              },
                          },
                          {
                              overview: {
                                  contains: q + "",
                              },
                          },
                          {
                              actors: {
                                  some: {
                                      name: {
                                          contains: q + "",
                                      },
                                  },
                              },
                          },
                          {
                              crews: {
                                  some: {
                                      name: {
                                          contains: q + "",
                                      },
                                  },
                              },
                          },
                          {
                              genres: {
                                  some: {
                                      name: {
                                          contains: q + "",
                                      },
                                  },
                              },
                          },
                      ],
                  },
                  include: {
                      actors: true,
                      crews: true,
                      genres: true,
                  },
              })
            : client.movie.findMany({
                  include: {
                      genres: true,
                  },
              }));
        return res.json({ ok: true, movies });
    }
}

export default widthHandler({ methods: ["GET"], handler });
