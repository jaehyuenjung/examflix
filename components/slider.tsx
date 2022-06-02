import { makeImagePath } from "@libs/client/utils";
import { Movie } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import BigMovie from "./bigMovie";

// 한 페이지(skip) 당 영화 개수
const take = 8;

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
    title: string;
    movies: Movie[];
}

const Slider: NextPage<SliderProps> = ({ title, movies }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [skip, setSkip] = useState(0);
    const [leaving, setLeaving] = useState(false);

    const [open, setOpen] = useState(false);
    const [seletedId, setSeletedId] = useState<number>();

    const perMovies: Movie[] = movies
        ? movies.slice(take * skip, take * skip + take)
        : [];

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
    const onBoxClicked = (movidId: number) => {
        setOpen(true);
        setSeletedId(movidId);
    };
    return (
        <div ref={divRef} className="absolute w-full space-y-2 top-[75%]">
            <div>
                <h1 className="text-white font-bold text-xl">{title}</h1>
            </div>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <motion.div
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={skip}
                    className={`grid gap-[5px] grid-cols-8 absolute w-full`}
                >
                    {perMovies.map((movie) => (
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
                            }}
                            layoutId={movie.id + ""}
                            onClick={() => onBoxClicked(movie.id)}
                            variants={BoxVariants}
                            initial="normal"
                            key={movie.id}
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            className="bg-white aspect-[1/1.4] text-[66px] cursor-pointer first:origin-center-left sldier-last-child bg-cover"
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
                <BigMovie
                    open={open}
                    movieId={seletedId}
                    onCloseCallback={() => {
                        setOpen(false);
                        setSeletedId(undefined);
                    }}
                />
            </AnimatePresence>
        </div>
    );
};

export default Slider;
