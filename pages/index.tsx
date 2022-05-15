import Modal from "@components/Modal";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [isopen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="" onClick={() => setIsOpen(true)}>
        hello
      </button>

      <Modal open={isopen} onClose={() => setIsOpen(false)}>
        <div>hello</div>
      </Modal>
    </div>
  );
};

export default Home;
