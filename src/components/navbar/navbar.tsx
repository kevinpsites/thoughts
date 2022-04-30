import React from "react";
import appSettings from "appSettings.json";
import { ReactComponent as Thoughts } from "icons/thoughts.svg";
import { ReactComponent as Search } from "icons/search.svg";
import { ReactComponent as AddCircle } from "icons/addCircle.svg";
import { Link } from "react-router-dom";
import { ThreadParent } from "types/globalTypes";

const menuItems = [
  {
    title: "Thoughts",
    icon: <Thoughts className="nav-bar-thought" />,
    route: appSettings.routes.home,
  },
  {
    title: "New",
    icon: <AddCircle className={`nav-bar-add`} />,
    route: appSettings.routes.new,
  },
  {
    title: "Search",
    icon: <Search />,
    route: appSettings.routes.search,
  },
];

const shouldAppendParams = (
  route: string,
  currentParentThread?: ThreadParent
): string => {
  if (currentParentThread && route === "/new") {
    route += `?thread=${currentParentThread?.id}&threadTitle=${currentParentThread?.title}`;
  }
  return route;
};

export default function NavBar({
  currentParentThread,
}: {
  currentParentThread?: ThreadParent;
}) {
  return (
    <nav>
      <ul className={`nav-bar-list`}>
        {menuItems.map(({ route, title, icon }, iIndex) => (
          <li key={iIndex}>
            <Link to={shouldAppendParams(route, currentParentThread)}>
              <span>{icon}</span>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
