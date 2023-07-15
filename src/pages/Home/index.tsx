import "./home.css";
import { Link } from "react-router-dom";
import NebulaLogo from "../../assets/logo-nebula.svg";
import MenuButton from "../../components/Button";
import { v4 as uuidv4 } from "uuid";
const Home = () => {
	return (
		<div className="app__home">
			<Link to={`/editor/${uuidv4()}`}>
				<MenuButton variant="navigation">Create Note</MenuButton>
			</Link>
			<img src={NebulaLogo} />
		</div>
	);
};

export default Home;
