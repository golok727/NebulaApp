import React from "react";
import "./editor.css";
import { useParams } from "react-router-dom";
import TopBar from "../../components/topbar";
const Editor = () => {
	const { notebook } = useParams();

	return (
		<div className="app__editor">
			<TopBar />
			{notebook}
		</div>
	);
};

export default Editor;
