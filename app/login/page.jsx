"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/authSlice";
import "./login.css";
import { UsedAPI } from "../api/BaseUrl";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    let response;
    try {
      response = await fetch(`${UsedAPI}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      setError("Could not reach the login service. Please try again later.");
      setLoading(false);
      return;
    }

    if (!response.ok) {
      setError(`Login failed (HTTP ${response.status}). Please check your credentials and try again.`);
      setLoading(false);
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      setError("The login service returned an invalid response.");
      setLoading(false);
      return;
    }

    if (!data || !data.user || typeof data.user !== "object" || Array.isArray(data.user) ||
        typeof data.token !== "string" || !data.token.trim()) {
      setError("The login service returned an invalid response.");
      setLoading(false);
      return;
    }

    dispatch(login({ user: data.user, token: data.token }));
    setPassword("");
    setLoading(false);
    router.replace("/");
  }

  return (
    <div className="page login-container">
      <div className="login-card">
        <h1>{user ? "Logged in" : "Login"}</h1>
        {user ? (
          <div className="login-form">
            <button type="button" onClick={() => dispatch(logout())}>Log out</button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="login-error" role="alert">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
