import { ReactComponent as BackArrow } from "icons/arrowBack.svg";
import { Link } from "react-router-dom";

export default function BackButton() {
  return (
    <Link to={"/"} className="back-button">
      <BackArrow />
    </Link>
  );
}
