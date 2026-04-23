import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface HomeSectionLinkProps {
  section: string;
  children: ReactNode;
  className?: string;
}

export const HomeSectionLink = ({ section, children, className }: HomeSectionLinkProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const to = isHome ? `/?section=${section}` : `/?section=${section}`;

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};
