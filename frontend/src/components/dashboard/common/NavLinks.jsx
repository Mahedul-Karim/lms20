import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../ui/modal/ConfirmationModal";
import { useLogout } from "../../../hooks/useLogout";

const NavLinks = ({ id, icon, title, to }) => {
  const location = useLocation();

  const { showModal, setShowModal, logoutHandler, isPending } = useLogout();

  return (
    <>
      {id < 4 ? (
        <NavLink
          to={to}
          className={`${
            location.pathname === to && "lg:bg-yellow800 text-yellow50"
          } lg:pl-8 py-2 flex items-center gap-2`}
        >
          {icon} <span className="hidden lg:inline-block">{title}</span>
        </NavLink>
      ) : (
        <>
          {id < 5 && (
            <div className="h-[0.5px] bg-richblack-700 w-10/12 mx-auto my-4 hidden lg:block" />
          )}
          {id === 4 && (
            <NavLink
              to={to}
              className={`${
                location.pathname === to && "lg:bg-yellow800 text-yellow50"
              } lg:pl-8 py-2 flex items-center gap-2`}
            >
              {icon} <span className="hidden lg:inline-block">{title}</span>
            </NavLink>
          )}
          {id === 5 && (
            <button
              className={`${
                location.pathname === to && "bg-yellow800 text-yellow50"
              } lg:pl-8 py-2 flex items-center gap-2`}
              onClick={setShowModal.bind(null, true)}
            >
              {icon} <span className="hidden lg:inline-block">{title}</span>
            </button>
          )}
        </>
      )}
      {showModal && (
        <ConfirmationModal
          heading={"Are you sure?"}
          paragraph={"You will be logged out of your account."}
          btn1text={"Log Out"}
          onClick2={setShowModal.bind(null, false)}
          onClick1={logoutHandler}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default NavLinks;
