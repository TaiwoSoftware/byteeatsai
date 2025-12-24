import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  title: string;
  children?: ReactNode;
}

export const NavLinks = ({ to, title, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <div
        className={`
          flex items-center px-4 py-2 rounded-lg cursor-pointer transition
          ${isActive ? "bg-orange-100 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"}
        `}
      >
        <p className="font-fredoka text-base">{title}</p>
        {children && <div className="ml-2">{children}</div>}
      </div>
    </Link>
  );
};
