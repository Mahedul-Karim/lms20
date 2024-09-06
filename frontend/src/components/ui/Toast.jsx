import React from "react";
import { useToast } from "../../hooks/useToast";

import { RxCross1 } from "react-icons/rx";

import { useSelector } from "react-redux";

import { FaRegCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";

const styles = {
  error: {
    bg: "bg-primary",
    title: <MdErrorOutline size={20} />,
    text: "text-white",
  },
  success: {
    bg: "bg-green-300",
    title: <FaRegCircleCheck size={18} />,
    text: "text-white",
  },
  warning: {
    bg: "bg-[#F28C28]",
    title: <IoWarningOutline size={20} />,
    text: "text-white",
  },
};

const Toast = () => {
  const { toasts } = useSelector((state) => state.toast);

  const { removeToast } = useToast();

  return (
    <>
      <div
        className="fixed inset-4 flex pointer-events-none flex-col justify-end items-end z-[99999] gap-4 overflow-x-clip"
        id="toast-container"
      >
        {toasts.length > 0 &&
          toasts.map((toast) => {
            const { bg, title, text } = styles[toast?.type];

            return (
              <div
                className={`w-[270px] 400px:w-[300px] sm:w-[350px] min-h-[75px] ${bg} rounded-md ${text} overflow-clip flex gap-2 pointer-events-auto slide px-4 `}
                key={toast?.id}
                data-id={toast?.id}
              >
                <div className="flex items-center justify-between w-full py-2">
                  <div className="flex items-center gap-2">
                    <h2 className={`font-semibold`}>{title}</h2>
                    <p className="font-medium whitespace-pre-line">
                      {toast?.message}
                    </p>
                  </div>
                  <div className="px-2">
                    <button onClick={() => removeToast(toast?.id)}>
                      <RxCross1 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Toast;
