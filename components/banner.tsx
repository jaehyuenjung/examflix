import { cls, randomInt } from "@libs/client/utils";
import { Movie } from "@prisma/client";
import { MovieResponse } from "@types.ts";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
    ssr: false,
});

const Banner: NextPage = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const { data } = useSWR<MovieResponse>(
        typeof window === "undefined" ? null : "/api/movies"
    );
    const [index, setIndex] = useState(0);
    const [width, setWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (data && data.ok) {
            setIndex(randomInt(data.movies.length));
        }
    }, [data]);

    useEffect(() => {
        if (data && data.ok && !data.movies[index]?.video_path) {
            setTimeout(() => {
                setIndex(randomInt(data.movies.length));
            }, 1000 * 15);
        }
    }, [index, data]);

    useEffect(() => {
        const pageResize = () => {
            if (divRef?.current) {
                const newWidth = divRef.current.clientWidth;
                setWidth(newWidth);
            }
        };
        pageResize();
        window.addEventListener("resize", pageResize);
        return () => {
            window.removeEventListener("resize", pageResize);
        };
    }, []);

    useEffect(() => {
        setIsMobile(width < 768);
    }, [width]);

    const selectedMovie = data?.movies[index];

    return (
        <div
            ref={divRef}
            style={{
                top: isMobile ? `-${width / 768 + 10}%` : "0",
            }}
            className={cls(
                "absolute w-full h-full flex flex-col justify-center bg-cover bg-black left-0",
                isMobile ? "" : "p-16"
            )}
        >
            {selectedMovie ? (
                <>
                    {selectedMovie.video_path ? (
                        <div className="absolute w-full h-full left-0 top-0">
                            <ReactPlayer
                                wrapper={({ children }) => (
                                    <div className="absolute w-full h-full left-0 top-0">
                                        {children}
                                    </div>
                                )}
                                playing
                                muted
                                url={selectedMovie.video_path!}
                                onEnded={() => {
                                    setIndex(randomInt(data.movies.length));
                                }}
                                config={{
                                    playerVars: {
                                        cc_load_policy: 0,
                                        autoplay: 1,
                                        controls: 0,
                                        odestbranding: 1,
                                        fs: 0,
                                        rel: 0,
                                        iv_load_policy: 3,
                                        loop: 0,
                                        disablekb: 1,
                                        enablejsapi: 0,
                                    },
                                }}
                            />

                            <div
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))`,
                                }}
                                className="absolute w-full h-full bg-transparent"
                            ></div>
                        </div>
                    ) : (
                        <div
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${
                                    selectedMovie.poster_path
                                        ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
                                        : ""
                                })`,
                                backgroundSize: "80% 100%",
                            }}
                            className="absolute w-full h-full left-0 top-0 bg-no-repeat bg-center"
                        />
                    )}{" "}
                    <div className="absolute w-full h-full left-0 top-0 text-white">
                        <div
                            className={cls(
                                "absolute flex flex-col",
                                isMobile
                                    ? "left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/4  space-y-4"
                                    : " left-[15%] top-[30%]  space-y-8"
                            )}
                        >
                            <h1
                                className={cls(
                                    "w-full font-bold",
                                    isMobile
                                        ? "text-2xl text-center"
                                        : "text-4xl "
                                )}
                            >
                                {selectedMovie.title}
                            </h1>
                            {isMobile ? (
                                <div className="flex justify-center items-center">
                                    {selectedMovie.genres.map((genre, i) => (
                                        <div
                                            key={genre.id}
                                            className="flex justify-center items-center space-x-1 mr-1"
                                        >
                                            <span className="whitespace-nowrap">
                                                {genre.name}
                                            </span>
                                            {i !==
                                                selectedMovie.genres.length -
                                                    1 && (
                                                <div className="w-1 aspect-square bg-white rounded-full flex justify-center items-center" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className={cls(
                                        "w-[60%]",
                                        isMobile ? "text-sm" : ""
                                    )}
                                >
                                    {selectedMovie.overview.length > 250
                                        ? `${selectedMovie.overview.slice(
                                              0,
                                              250
                                          )}...`
                                        : selectedMovie.overview}
                                </div>
                            )}
                            <div
                                className={cls(
                                    "flex space-x-4",
                                    isMobile
                                        ? "justify-center items-center"
                                        : ""
                                )}
                            >
                                <div
                                    className={cls(
                                        "rounded-md bg-gray-500 hover:bg-red-600 cursor-pointer",
                                        isMobile
                                            ? "px-3 py-2 text-sm"
                                            : "px-4 py-3 "
                                    )}
                                >
                                    ▶️ 재생
                                </div>
                                <div
                                    className={cls(
                                        "rounded-md bg-gray-500 hover:bg-red-600 cursor-pointer",
                                        isMobile
                                            ? "px-3 py-2 text-sm"
                                            : "px-4 py-3 "
                                    )}
                                >
                                    상세 정보
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default React.memo(Banner);
