import "./home.css";
import { Link } from "react-router-dom";
import NebulaLogo from "../../assets/logo-nebula.svg";
import MenuButton from "../../components/Button";
import { v4 as uuidv4 } from "uuid";
const Home = () => {
	return (
		<div className="app__home">
			<MenuButton variant="navigation">
				<Link to={`/editor/${uuidv4()}`}>Create Note</Link>
			</MenuButton>
			<img src={NebulaLogo} />
		</div>
	);
};

export default Home;
