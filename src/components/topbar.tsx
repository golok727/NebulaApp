import "./topbar.css";
import AppLogo from "../assets/logo-nebula.svg";
import MenuButton from "./Button";

import {
	EllipsisHorizontalCircleIcon,
	HomeIcon,
	CloudIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";

import { Link } from "react-router-dom";
import Button from "./Button";
const TopBar = () => {
	return (
		<div className="top-bar">
			<div className="top-bar__left">
				<img src={AppLogo} alt="AppLogo" className="app-logo" />
				<MenuItems />
			</div>

			<div className="top-bar__right">
				<Link to="/" className="top-bar__link">
					<HomeIcon width={19} />
				</Link>

				<Button variant="transparent">
					<CloudIcon width={19} />
				</Button>

				<Button variant="transparent">
					<EllipsisHorizontalCircleIcon width={19} />
				</Button>

				<Button variant="transparent">
					<UserCircleIcon width={19} />
				</Button>
			</div>
		</div>
	);
};

export default TopBar;
const MenuItems = () => {
	return (
		<ul className="top-bar__tray">
			{["File", "Edit", "View", "Help"].map((item, idx) => (
				<li key={idx}>
					<MenuButton variant="menu">{item}</MenuButton>
				</li>
			))}
		</ul>
	);
};
