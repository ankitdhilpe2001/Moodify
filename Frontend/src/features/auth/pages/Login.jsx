import { useState } from "react";
import "../styles/login.scss";
import { useAuth } from "../hook/use.auth";
import { useNavigate } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const navigate = useNavigate();

  const { loading, handleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      password: formData.password,
      ...(formData.identifier.includes("@")? { email: formData.identifier }: { username: formData.identifier }),
    };

    try {
      await handleLogin(credentials);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand__name">Moodify</h1>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form__field">
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              value={formData.identifier}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="identifier">Username or email</label>
          </div>

          <div className="login-form__field login-form__field--password">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"} //If show password is true then the input type is text else password
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
            {/* If the password is field is not empty then show the button for hide/show password */}
            {formData.password && (
              <button
                type="button"
                className="login-form__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>

          <button
            type="submit"
            className={`login-form__submit ${loading ? "login-form__submit--loading" : ""}`}
            disabled={!formData.identifier || !formData.password || loading}
          >
            {loading ? <span className="spinner" /> : "Log in"}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="login-footer">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
