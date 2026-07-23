import "../styles/login.scss";

const AuthLoading = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand__name">Moodify</h1>
        <span className="spinner spinner--dark" aria-label="Loading" />
      </div>
    </div>
  );
};

export default AuthLoading;
