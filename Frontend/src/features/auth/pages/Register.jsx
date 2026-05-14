import { useState } from "react";
import "../styles/register.scss";
import { useNavigate } from "react-router";
import { useAuth } from "../hook/use.auth";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerPayload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      await handleRegister(registerPayload);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const isDisabled =
    !formData.username || !formData.email || !formData.password || loading;

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-brand">Moodify</h1>
        <p className="register-subtitle">Sign up to share your world.</p>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="register-form__field">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="register-form__field">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="register-form__field register-form__field--password">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
            {formData.password && (
              <button
                type="button"
                className="register-form__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>

          <button
            type="submit"
            className={`register-form__submit ${loading ? "register-form__submit--loading" : ""}`}
            disabled={isDisabled}
          >
            {loading ? <span className="spinner" /> : "Sign up"}
          </button>
        </form>

        <div className="register-divider">
          <span>OR</span>
        </div>

        <p className="register-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
