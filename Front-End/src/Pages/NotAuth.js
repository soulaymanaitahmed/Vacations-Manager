import { MdOutlineLockPerson } from "react-icons/md";
import "../Style/notaut.css";
function NotAuth() {
  return (
    <div className="not66">
      <MdOutlineLockPerson className="desoalert" />
      <span className="deso44">
        Désolé, vous n'avez pas accès à cette page avec ce compte.
      </span>
    </div>
  );
}
export default NotAuth;
