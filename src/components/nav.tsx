import { headers } from "next/headers";
import React from "react";

const Nav: React.FC = () => {
  return (
    <header
  className="sticky top-0 z-10 pt-6 pb-5 backdrop-filter backdrop-blur
                   dark:bg-primary dark:text-white">
    <nav className="flex items-center justify-between h-16 font-semibold text-sm
       after:absolute after:inset-x-0 after:w-full after:h-12 after:shadow-hr after:z-[-1]">
      <p className="text-1E635F text-2xl font-bold ml-[1rem]"> Debate Me</p>
      
    </nav>
    </header>
  );
};

export default Nav;
