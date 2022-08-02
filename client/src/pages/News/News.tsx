import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { Footer } from "../../components/Footer/Footer";
import { BackButton } from "../BackButton";
import "./News.scss";

export const News = () => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (location.pathname === "/news") toast.dismiss();
  }, [location]);

  return (
    <div className={`news_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`news_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton />
        HOLLYWOODLE NEWS
      </h2>
      <div className="news_prompt">
        <p>The latest breaking Hollywoodle news.</p>
      </div>
      <Footer />
    </div>
  );
};
