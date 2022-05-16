import { makeImagePath } from "@libs/client/utils";
import { Movie } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { IMovieDetail } from "pages";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";

// 한 페이지(skip) 당 영화 개수
const take = 6;

const BoxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: { type: "tween", duaration: 0.1, delay: 0.5 },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: { type: "tween", duaration: 0.3, delay: 0.5 },
    },
};

interface SliderProps {
    movies: IMovieDetail[];
}

const Slider: NextPage<SliderProps> = ({ movies }) => {
    const router = useRouter();
    const { index } = router.query;
    const divRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [skip, setSkip] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const perMovies: IMovieDetail[] = movies
        ? movies.slice(take * skip, take * skip + take)
        : [];
    const selectedMovie = index ? perMovies[Number(index)] : undefined;
    useEffect(() => {
        if (divRef?.current) {
            setWidth(divRef.current.clientWidth);
        }
    }, []);

    const rowVariants = {
        hidden: {
            x: width + 5,
        },
        visible: {
            x: 0,
        },
        exit: {
            x: -width - 5,
        },
    };

    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (i: number) => {
        if (router.query.keyword) {
            router.push(`${router.asPath}&index=${i}`);
        } else {
            router.push(`/?index=${i}`);
        }
    };
    const onClick = () => {
        router.back();
    };
    const onSearch = (keyword: string) => {
        router.push(`/?keyword=${keyword}`);
    };
    return (
        <div ref={divRef} className="relative w-full top-[72%] space-y-2">
            <div>
                <h1 className="text-white font-bold text-xl">신규 콘텐츠</h1>
            </div>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <motion.div
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={skip}
                    className="grid gap-[5px] grid-cols-6 absolute w-full"
                >
                    {perMovies.map((movie, i) => (
                        <motion.div
                            style={{
                                backgroundImage: `url(${
                                    movie.poster_path
                                        ? makeImagePath(
                                              movie.poster_path,
                                              "w500"
                                          )
                                        : ""
                                })`,
                                backgroundPosition: "center center",
                                backgroundSize: "100% 100%",
                            }}
                            layoutId={movie.id + ""}
                            onClick={() => onBoxClicked(i)}
                            variants={BoxVariants}
                            initial="normal"
                            key={movie.id}
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            className="bg-white h-36 text-[66px] cursor-pointer first:origin-center-left last:origin-center-right"
                        >
                            <motion.div
                                variants={infoVariants}
                                className="p-3 bg-gray-700 opacity-0 absolute w-full bottom-0"
                            >
                                <h4 className="text-center text-xs">
                                    {movie.title}
                                </h4>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {index && (
                    <div className="fixed w-screen h-screen flex justify-center items-center top-0 z-50">
                        <motion.div
                            onClick={onClick}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed w-full h-full bg-black bg-opacity-50 opacity-0 top-0"
                        />
                        <motion.div
                            layoutId={selectedMovie?.id + ""}
                            className="absolute w-[40vw] h-[80vh] left-0 right-0 m-auto bg-black rounded-md overflow-y-auto will-change-transform overflow-x-hidden"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                {selectedMovie?.video_path ? (
                                    <>
                                        <ReactPlayer
                                            wrapper={({ children }) => (
                                                <div className="absolute w-full h-full left-0 top-0">
                                                    {children}
                                                </div>
                                            )}
                                            playing
                                            muted
                                            url={selectedMovie?.video_path!}
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
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${
                                                selectedMovie?.poster_path
                                                    ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
                                                    : ""
                                            })`,
                                            backgroundSize: "80% 100%",
                                        }}
                                        className="absolute w-full h-full left-0 top-0 bg-no-repeat bg-center"
                                    />
                                )}
                                <div className="absolute bottom-[25%] left-[2.75rem]">
                                    <h1 className="text-white text-2xl">
                                        {selectedMovie?.title}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex mb-5">
                                <div
                                    style={{
                                        gridTemplateColumns: "70% 30%",
                                    }}
                                    className="grid"
                                >
                                    <div className="">
                                        <div className="flex space-x-5 mx-11 text-gray-50 items-center">
                                            {selectedMovie &&
                                            selectedMovie?.certification !==
                                                -1 ? (
                                                <span>
                                                    {
                                                        selectedMovie?.certification
                                                    }
                                                    세 이상
                                                </span>
                                            ) : null}
                                            {selectedMovie &&
                                            selectedMovie?.runtime !== -1 ? (
                                                <span>
                                                    {selectedMovie.runtime}분
                                                </span>
                                            ) : null}
                                            <span>
                                                {selectedMovie?.release_date}
                                            </span>
                                        </div>
                                        <div className="text-gray-50 mx-11 flex-1">
                                            {selectedMovie?.overview}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="w-full space-x-1">
                                            <span className="text-gray-50 text-opacity-70">
                                                배우:
                                            </span>
                                            <span className="flex flex-wrap space-x-2 gap-y-2">
                                                {selectedMovie?.actors.map(
                                                    (actor) => (
                                                        <span
                                                            onClick={() =>
                                                                onSearch(
                                                                    actor.name
                                                                )
                                                            }
                                                            key={actor.id}
                                                            className="text-gray-50 bg-gray-400 bg-opacity-40 leading-5 rounded-md px-1 text-sm cursor-pointer"
                                                        >
                                                            {actor.name}
                                                        </span>
                                                    )
                                                )}
                                            </span>
                                        </div>
                                        <div className="w-full space-x-1">
                                            <span className="text-gray-50 text-opacity-70">
                                                장르:
                                            </span>
                                            <span className="flex flex-wrap space-x-2 gap-y-2">
                                                {selectedMovie?.genres.map(
                                                    (genre) => (
                                                        <span
                                                            onClick={() =>
                                                                onSearch(
                                                                    genre.name
                                                                )
                                                            }
                                                            key={genre.id}
                                                            className="text-gray-50 bg-gray-400 bg-opacity-40 leading-5 rounded-md px-1 text-sm cursor-pointer"
                                                        >
                                                            {genre.name}
                                                        </span>
                                                    )
                                                )}
                                            </span>
                                        </div>
                                        <div className="w-full space-x-1">
                                            <span className="text-gray-50 text-opacity-70">
                                                감독:
                                            </span>
                                            <span className="flex flex-wrap space-x-2 gap-y-2">
                                                {selectedMovie?.crews.map(
                                                    (crew) => (
                                                        <span
                                                            onClick={() =>
                                                                onSearch(
                                                                    crew.name
                                                                )
                                                            }
                                                            key={crew.id}
                                                            className="text-gray-50 bg-gray-400 bg-opacity-40 leading-5 rounded-md px-1 text-sm cursor-pointer"
                                                        >
                                                            {crew.name}
                                                        </span>
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Slider;
