import { HTMLAttributes, ReactNode } from "react";
import "./button.css";

interface Props extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?:
		| "menu"
		| "navigation"
		| "default"
		| "transparent"
		| "transparent white";
}
const Button: React.FC<Props> = ({ children, variant = "default" }) => {
	return <button className={`app__button ${variant}`}>{children}</button>;
};

export default Button;
