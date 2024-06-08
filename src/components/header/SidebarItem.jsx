import { Link } from "react-router-dom";

export function SidebarItem({ item, isActive, onClick }) {
  return (
    <li className={isActive ? "active" : ""} onClick={onClick}>
      <Link to={item.link}>
        <i className={item.icon}></i>
        <span className="text">{item.text}</span>
      </Link>
    </li>
  );
}
