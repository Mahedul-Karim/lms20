import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ containerStyle }) => {
  return (
    <Link
      className={`${containerStyle} flex items-center text-white gap-1 cursor-pointer`}
      to={"/"}
    >
      <p className="bg-primary text-2xl font-semibold size-9 flex items-center justify-center rounded-full">
        S
      </p>
      <p className="text-lg font-semibold dark:text-white text-[#392C7D]">
        Notion
      </p>
    </Link>
  );
};

export default Logo;
