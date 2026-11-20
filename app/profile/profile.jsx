"use client";

import { useState } from "react";
import Link from "../../components/ApiLink";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/authSlice";
import "../login/login.css";
import "./profile.css";
import { getUsedAPI } from "../api/BaseUrl";
import { withCurrentAPI } from "../api/navigation";

function ProfileForm({ user, token }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [values, setValues] = useState({
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    email: user.email ?? "",
    tlf: user.tlf ?? "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const hasChanges = Object.keys(values).some(
    (key) => values[key] !== (user[key] ?? "")
  ) || password !== "" || passwordConfirmation !== "";

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setError("");
    setMessage("");
  }

  function handleCancel() {
    setValues({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      tlf: user.tlf ?? "",
    });
    setCurrentPassword("");
    setPassword("");
    setPasswordConfirmation("");
    setError("");
    setMessage("");
    router.push(withCurrentAPI("/"));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if ((password || passwordConfirmation) && (!password || password !== passwordConfirmation)) {
      setError("De nye adgangskoder skal være ens.");
      return;
    }

    setSaving(true);
    let response;
    try {
      response = await fetch(`${getUsedAPI()}profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          current_password: currentPassword,
          ...(password ? { password, password_confirmation: passwordConfirmation } : {}),
        }),
      });
    } catch {
      setError("Kunne ikke oprette forbindelse til profiltjenesten. Prøv igen senere.");
      setSaving(false);
      return;
    }

    if (!response.ok) {
      setError(`Kunne ikke gemme din profil (HTTP ${response.status}).`);
      setSaving(false);
      return;
    }

    dispatch(updateUser({ token, values }));
    setCurrentPassword("");
    setPassword("");
    setPasswordConfirmation("");
    setSaving(false);
    setMessage("Ændringerne til din profil er gemt.");
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="first_name">Fornavn</label>
      <input id="first_name" name="first_name" autoComplete="given-name" value={values.first_name} onChange={handleChange} disabled={saving} required />

      <label htmlFor="last_name">Efternavn</label>
      <input id="last_name" name="last_name" autoComplete="family-name" value={values.last_name} onChange={handleChange} disabled={saving} required />

      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} disabled={saving} required />

      <label htmlFor="tlf">Telefonnummer</label>
      <input id="tlf" name="tlf" type="tel" autoComplete="tel" value={values.tlf} onChange={handleChange} disabled={saving} />

      <label htmlFor="new-password">Ny adgangskode (valgfrit)</label>
      <input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); setMessage(""); }} disabled={saving} />

      <label htmlFor="password-confirmation">Bekræft ny adgangskode</label>
      <input id="password-confirmation" type="password" autoComplete="new-password" value={passwordConfirmation} onChange={(event) => { setPasswordConfirmation(event.target.value); setError(""); setMessage(""); }} disabled={saving} />

      {hasChanges ? (
        <>
          <label htmlFor="current-password">Nuværende adgangskode</label>
          <input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} disabled={saving} required />
          <div className="profile-actions">
            <button type="button" disabled={saving} onClick={handleCancel}>Annuller</button>
            <button type="submit" disabled={saving}>{saving ? "Gemmer..." : "Gem ændringer"}</button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => router.push(withCurrentAPI("/"))}>Tilbage til forsiden</button>
      )}
      {error && <p className="login-error" role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
    </form>
  );
}

export default function ProfilePage() {
  const { user, token } = useSelector((state) => state.auth);

  return (
    <div className="page login-container" lang="da">
      <div className="login-card">
        <h1>Profil</h1>
        {user && token ? (
          <ProfileForm key={user.uid} user={user} token={token} />
        ) : (
          <p className="profile-login-prompt">Du er ikke logget ind. <Link href="/login">Log ind</Link></p>
        )}
      </div>
    </div>
  );
}
