import { cls } from "@libs/client/utils";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
    keyword: string;
}

function Header() {
    const router = useRouter();
    const navRef = useRef<HTMLElement>(null);
    const [inputOpen, setInputOpen] = useState(false);
    const [width, setWidth] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const { register, handleSubmit } = useForm<IForm>();
    const onValid = (data: IForm) => {
        router.push(`/search?q=${data.keyword}`);
    };

    useEffect(() => {
        const pageResize = () => {
            if (navRef?.current) {
                const newWidth = navRef.current.clientWidth;
                setWidth(newWidth);
            }
        };
        pageResize();
        window.addEventListener("resize", pageResize);
        return () => {
            window.removeEventListener("resize", pageResize);
        };
    }, []);

    const isMobile = width < 768;

    return (
        <motion.nav
            ref={navRef}
            onHoverStart={isMobile ? undefined : () => setSearchOpen(true)}
            onHoverEnd={
                isMobile
                    ? undefined
                    : () => {
                          setSearchOpen(false);
                          setInputOpen(false);
                      }
            }
            className={cls(
                "flex justify-between fixed w-full top-0 text-[14px] py-4 text-white z-50 bg-black",
                isMobile ? "px-3" : "px-5"
            )}
        >
            <div className="flex items-center">
                <svg
                    onClick={() => router.push("/")}
                    xmlns="http://www.w3.org/2000/svg"
                    width="1024"
                    height="276.742"
                    viewBox="0 0 1024 276.742"
                    className={cls(
                        "w-24 h-7 fill-red-600 cursor-pointer",
                        isMobile ? "mr-7" : "mr-14"
                    )}
                >
                    <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
                </svg>
                <ul className="flex items-center">
                    <motion.li
                        className="text-white text-opacity-60 relative flex justify-center flex-col"
                        whileHover={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        <Link href="/">
                            <a className="flex flex-col justify-center items-center">
                                Home{" "}
                                <motion.span
                                    layoutId="circle"
                                    className="absolute w-1 h-1 rounded-sm -bottom-1 left-0 right-0 m-auto bg-red-500"
                                />
                            </a>
                        </Link>
                    </motion.li>
                </ul>
            </div>
            <div className="flex items-center">
                <form
                    onSubmit={handleSubmit(onValid)}
                    className="text-white flex items-center relative"
                >
                    <motion.svg
                        animate={{
                            x: searchOpen ? (isMobile ? -125 : -215) : 0,
                        }}
                        onClick={
                            isMobile
                                ? () => {
                                      if (searchOpen) setInputOpen(false);
                                      setSearchOpen((prev) => !prev);
                                  }
                                : undefined
                        }
                        onAnimationComplete={() => {
                            if (searchOpen) {
                                setInputOpen(true);
                            }
                        }}
                        transition={{ type: "linear" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 z-10"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        ></path>
                    </motion.svg>
                    <motion.input
                        {...register("keyword", {
                            required: true,
                        })}
                        style={{
                            width: isMobile ? 160 : "",
                            transformOrigin: "right center",
                        }}
                        animate={inputOpen ? { opacity: 1 } : { opacity: 0 }}
                        transition={
                            inputOpen ? { duration: 0.2 } : { duration: 0 }
                        }
                        placeholder="Search for movie..."
                        className={cls(
                            "absolute right-0 px-8 py-1 pl-10 text-white text-base bg-transparent border rounded-md ",
                            inputOpen
                                ? "scale-x-100 ring-1 right-white"
                                : "scale-x-0"
                        )}
                    />
                </form>
            </div>
        </motion.nav>
    );
}

export default Header;
