import { useState } from "react";
import { useCookies } from "react-cookie";
import "./Auth.css";

export default function Auth({setLoginName}) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogin, setIsLogin] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const action = isLogin ? "login" : "signup";

  // console.log(username, email, password, confirmPassword);

  const viewLogin = function (status) {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async function (e, endpoint) {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError("Make Sure Passwords Match");
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_SERVERURL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );
    const data = await response.json();
    // console.log(data);
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);
      // console.log(data)
      // console.log(data.username)
      setLoginName(data.username)
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-options">
        <button
          onClick={() => viewLogin(false)}
          style={{
            backgroundColor: !isLogin
              ? "rgb(255,255,255)"
              : "var(--heading-color)",
          }}
        >
          Sign Up
        </button>
        <button
          onClick={() => viewLogin(true)}
          style={{
            backgroundColor: isLogin
              ? "rgb(255,255,255)"
              : "var(--heading-color)",
          }}
        >
          Log In
        </button>
      </div>

      <h2>Please {isLogin ? "Log In" : "Sign Up"}</h2>
      <div className="auth-container-box">
        <form action="">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <input
            type="submit"
            className="auth-btn"
            value="SUBMIT"
            id="submit"
            onClick={(e) => handleSubmit(e, action)}
          />
          {error && <p id="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
