import { NextPage } from "next";
import { motion } from "framer-motion";

const Loading: NextPage = () => {
    return (
        <div className="w-full h-full flex justify-center items-center space-x-5">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 1,
                    repeatDelay: 0,
                }}
                className="w-12 aspect-square rounded-full border-[3px] border-black border-t-[#F1061D]"
            />
            <div className="text-white">Loading...</div>
        </div>
    );
};

export default Loading;
