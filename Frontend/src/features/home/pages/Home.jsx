import React, { useState } from "react";
import { useNavigate } from "react-router";
import FaceExpression from "../../Expressions/components/FaceExpression";
import { useAuth } from "../../auth/hook/use.auth";
import MP3Player from "../components/MP3Player";
import "../styles/home.scss";

const Home = () => {
  const navigate = useNavigate();
  const { handleLogout, loading } = useAuth();
  const [detectedMood, setDetectedMood] = useState("happy");

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-page">
      <button
        type="button"
        className="home-page__logout"
        onClick={onLogout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
      <div className="home-page__content">
        <section className="home-page__face-panel">
          <FaceExpression onMoodDetected={setDetectedMood} />
        </section>
        <aside className="home-page__player-panel">
          <MP3Player mood={detectedMood} />
        </aside>
      </div>
    </div>
  );
};

export default Home;
