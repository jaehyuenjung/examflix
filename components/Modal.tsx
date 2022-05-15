import React from "react";
import ReactDOM from "react-dom";
const MODAL_STYLES = {
  positon: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 100,
};

export default function Modal({
  name,
  overview,
  img,
  open,
  children,
  onClose,
}) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-10 bg-black bg-opacity-80 backdrop-filter backdrop-blur-md backdrop-grayscale" />

      <div className="relative py-4 h-screen w-5/6 mx-auto overflow-hidden  bg-zinc-900  font-sans z-50">
        <div className="fixed z-20 top-0 right-0">
          <button onClick={onClose}>
            <svg
              aria-label="닫기"
              className="_8-yf5 "
              color="#ddd"
              fill="#ddd"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <polyline
                fill="none"
                points="20.643 3.357 12 12 3.353 20.647"
                stroke="currentColor"
              ></polyline>
              <line
                fill="none"
                stroke="currentColor"
                x1="20.649"
                x2="3.354"
                y1="20.649"
                y2="3.354"
              ></line>
            </svg>
          </button>
        </div>
        <div>
          <img className="w-full" src="/vercel.svg" />
          <div className="flex-col">
            <div className="w-2/3 float-left  ">
              <div className="left">
                <h1 className="inline-block  text-gray-50 my-2 mx-11">
                  영화 제목
                </h1>
                <h3 className="inline-block text-gray-50">런닝 타임</h3>
              </div>
              <p className="text-gray-50 mx-11">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <div className="w-1/3 float-right ">
              <div className="">
                <span className="text-gray-50 text-opacity-70">배우:</span>
                <span className="text-gray-50"> 강동1</span>
                <span className="text-gray-50"> 강동2</span>
                <span className="text-gray-50"> 강동3</span>
              </div>
              <div className="">
                <span className="text-gray-50 text-opacity-70">장르: </span>
                <span className="text-gray-50"> 장르</span>
                <span className="text-gray-50"> 장르</span>
                <span className="text-gray-50"> 장르</span>
              </div>
            </div>
            <div className="w-full float-left  ">
              <div className="left">
                <h1 className="inline-block  text-gray-50 my-2 mx-11">
                  영화 제목 + 상세정보
                </h1>
                <div className=" text-gray-50 my-2 mx-11">
                  <span className="text-gray-50 text-opacity-70">배우:</span>
                  <span className="text-gray-50"> 강동1</span>
                  <span className="text-gray-50"> 강동2</span>
                  <span className="text-gray-50"> 강동3</span>
                </div>
                <div className=" text-gray-50 my-2 mx-11">
                  <span className="text-gray-50 text-opacity-70">장르:</span>
                  <span className="text-gray-50"> 장르</span>
                  <span className="text-gray-50"> 장르</span>
                  <span className="text-gray-50"> 장르</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
