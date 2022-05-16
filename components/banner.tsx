import { Movie } from "@prisma/client";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
    ssr: false,
});

interface BannerProps {
    movies: Movie[];
}

function randomInt(length: number) {
    return Math.floor(Math.random() * length);
}

const Banner: NextPage<BannerProps> = ({ movies }) => {
    const [index, setIndex] = useState(randomInt(movies.length));

    useEffect(() => {
        if (!movies[index]?.video_path) {
            setTimeout(() => {
                setIndex(randomInt(movies.length));
            }, 1000 * 60);
        }
    }, [index, movies]);

    return (
        <div className="absolute w-full h-full flex flex-col justify-center p-16 bg-cover bg-black left-0 top-0">
            {movies[index].video_path ? (
                <div className="absolute w-full h-full left-0 top-0">
                    <ReactPlayer
                        wrapper={({ children }) => (
                            <div className="absolute w-full h-full left-0 top-0">
                                {children}
                            </div>
                        )}
                        playing
                        muted
                        url={movies[index].video_path!}
                        onEnded={() => {
                            setIndex(randomInt(movies.length));
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
                            movies[index].poster_path
                                ? `https://image.tmdb.org/t/p/original${movies[index].poster_path}`
                                : ""
                        })`,
                        backgroundSize: "80% 100%",
                    }}
                    className="absolute w-full h-full left-0 top-0 bg-no-repeat bg-center"
                />
            )}

            <div className="absolute w-full h-full left-0 top-0 text-white">
                <div className="absolute flex flex-col left-[15%] top-1/4 space-y-8">
                    <h1 className="text-4xl font-bold">
                        {movies[index].title}
                    </h1>
                    <div className="w-[40%]">
                        {movies[index].overview.length > 300
                            ? `${movies[index].overview.slice(0, 300)}...`
                            : movies[index].overview}
                    </div>
                    <div className="flex space-x-4">
                        <div className="px-4 py-3 rounded-md bg-gray-500 hover:bg-red-600 cursor-pointer">
                            ▶️ 재생
                        </div>
                        <div className="px-4 py-3 rounded-md bg-gray-500 hover:bg-red-600 cursor-pointer">
                            상세 정보
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Banner);
