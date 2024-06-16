import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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

SidebarItem.propTypes = {
  item: PropTypes.shape({
    link: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
