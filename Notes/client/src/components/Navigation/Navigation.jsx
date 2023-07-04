import { FaSearch } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useCookies } from "react-cookie";

import "./Navigation.css";

export default function Navigation({ loginName }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  // console.log(loginName);
  setTimeout(() => {
    document.querySelector(".adjust p").style.visibility = "hidden";
  }, 5000);
  const signOut = function () {
    window.location.reload();
    removeCookie("Email");
    removeCookie("AuthToken");
  };
  return (
    <header className="parent">
      <nav>
        <h1>Notes</h1>
        <div className="search">
          <FaSearch id="search-icon" className="icon" />
          <input id="search-box" type="text" name="" placeholder="Search" />
        </div>
        <div className="adjust">
          <p>Welcome Back, {loginName}</p>
          <button id="profile" onClick={signOut}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
