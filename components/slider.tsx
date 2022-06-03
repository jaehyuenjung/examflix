import { cls, makeImagePath } from "@libs/client/utils";
import { Movie } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import BigMovie from "./bigMovie";

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
    const [take, setTake] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [back, setBack] = useState(false);

    const [open, setOpen] = useState(false);
    const [seletedId, setSeletedId] = useState<number>();

    const perMovies: Movie[] = movies
        ? movies.slice(take * skip, take * skip + take)
        : [];

    useEffect(() => {
        const pageResize = () => {
            if (divRef?.current) {
                const newWidth = divRef.current.clientWidth;
                setWidth(newWidth);
                setTake(newWidth < 768 ? 4 : 7);
            }
        };
        pageResize();
        window.addEventListener("resize", pageResize);
        return () => {
            window.removeEventListener("resize", pageResize);
        };
    }, [divRef]);

    useEffect(() => {
        setIsMobile(width < 768);
    }, [width]);

    const rowVariants = {
        hidden: {
            x: back ? -width - 5 : width + 5,
        },
        visible: {
            x: 0,
        },
        exit: {
            x: back ? width + 5 : -width - 5,
        },
    };

    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movidId: number) => {
        setOpen(true);
        setSeletedId(movidId);
    };

    const isLeftExist = skip !== 0;
    const isRightExist = skip !== Math.floor(movies.length / take - 1);

    return (
        <div ref={divRef} className="absolute w-full space-y-2 top-[75%]">
            <div className="w-full flex justify-between items-center">
                <h1
                    className={cls(
                        "text-white font-bold",
                        isMobile ? "text-lg" : "text-xl"
                    )}
                >
                    {title}
                </h1>
                <motion.div
                    className={cls(
                        "flex justify-center items-center space-x-3 max-w-[60%] overflow-hidden mr-4"
                    )}
                >
                    {take &&
                        Array.from(
                            { length: Math.floor(movies.length / take) },
                            (_, i) => (
                                <div
                                    onClick={() => {
                                        if (leaving) return;
                                        setLeaving(true);
                                        if (skip > i) {
                                            new Promise((resolve) => {
                                                setBack(true);
                                                resolve(null);
                                            }).then(() => setSkip(i));
                                        } else {
                                            new Promise((resolve) => {
                                                setBack(false);
                                                resolve(null);
                                            }).then(() => setSkip(i));
                                        }
                                    }}
                                    key={i}
                                    className={cls(
                                        "rounded-md cursor-pointer",
                                        skip === i
                                            ? "bg-white"
                                            : "bg-gray-400 ",
                                        isMobile
                                            ? "px-[3px] py-[3px] "
                                            : "px-2 py-[2px] "
                                    )}
                                />
                            )
                        )}
                </motion.div>
            </div>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <motion.div
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={skip}
                    style={{
                        gridTemplateColumns: `0.5fr repeat(${take}, minmax(0, 1fr)) 0.5fr`,
                    }}
                    className={`grid gap-[5px] absolute w-full`}
                >
                    <motion.div
                        whileHover={{
                            opacity: 1,
                        }}
                        className={cls(
                            "w-full h-full flex justify-center items-center",
                            isMobile ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {isLeftExist && (
                            <motion.svg
                                animate={{
                                    color: isMobile
                                        ? "rgba(255,255,255,0.9)"
                                        : "rgba(55, 65, 81, 0.8)",
                                }}
                                whileHover={
                                    isMobile
                                        ? undefined
                                        : {
                                              color: "rgba(255,255,255,0.9)",
                                          }
                                }
                                onClick={() => {
                                    if (leaving) return;
                                    if (isLeftExist) {
                                        setLeaving(true);
                                        new Promise((resolve) => {
                                            setBack(true);
                                            resolve(null);
                                        }).then(() =>
                                            setSkip((prev) => prev - 1)
                                        );
                                    }
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-1/6 aspect-square cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </motion.svg>
                        )}
                    </motion.div>
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
                            className="bg-white aspect-[1/1.4] text-[66px] cursor-pointer bg-cover"
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
                    <motion.div
                        whileHover={{
                            opacity: 1,
                        }}
                        className={cls(
                            "w-full h-full flex justify-center items-center",
                            isMobile ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {isRightExist && (
                            <motion.svg
                                animate={{
                                    color: isMobile
                                        ? "rgba(255,255,255,0.9)"
                                        : "rgba(55, 65, 81, 0.8)",
                                }}
                                whileHover={
                                    isMobile
                                        ? undefined
                                        : {
                                              color: "rgba(255,255,255,0.9)",
                                          }
                                }
                                onClick={() => {
                                    if (leaving) return;
                                    setLeaving(true);
                                    if (isRightExist) {
                                        new Promise((resolve) => {
                                            setBack(false);
                                            resolve(null);
                                        }).then(() =>
                                            setSkip((prev) => prev + 1)
                                        );
                                    }
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-1/6 aspect-square cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </motion.svg>
                        )}
                    </motion.div>
                </motion.div>
                <BigMovie
                    open={open}
                    movieId={seletedId}
                    onCloseCallback={() => {
                        setOpen(false);
                        setSeletedId(undefined);
                    }}
                    divRef={divRef}
                />
            </AnimatePresence>
        </div>
    );
};

export default Slider;
