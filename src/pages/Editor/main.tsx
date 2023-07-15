import "./main.css";
import { useParams } from "react-router-dom";
import Sidebar from "./sidebar";

const Main = () => {
	const { notebook } = useParams();
	return (
		<div className="editor__main">
			<Sidebar />

			{notebook}
		</div>
	);
};

export default Main;
