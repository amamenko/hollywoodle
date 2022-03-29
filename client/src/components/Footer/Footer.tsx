import { useContext } from "react";
import { AppContext } from "../../App";
import { ReactComponent as TMDBLogo } from "../../assets/TMDBLogo.svg";
import { BsGithub } from "react-icons/bs";
import "./Footer.scss";

export const Footer = () => {
  const { darkMode } = useContext(AppContext);
  return (
    <div className={`footer_container ${darkMode ? "dark" : ""}`}>
      <p>
        Created by{" "}
        <a
          href="https://amamenko.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Avi Mamenko
        </a>
        . Original concept by Alex Jaloza.
      </p>
      <br />
      <p>
        Movie data provided by the{" "}
        <a
          href="https://developers.themoviedb.org/3/getting-started/introduction"
          target="_blank"
          rel="noopener noreferrer"
        >
          TMDB API
        </a>
        .
      </p>
      <div className="footer_links_container">
        <a
          className="footer_icon_link"
          href="https://github.com/amamenko/hollywoodle"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BsGithub color="#fff" size={15} />
        </a>
        <a
          className="footer_icon_link"
          href="https://www.themoviedb.org/?language=en-US"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TMDBLogo className="tmdb_logo" />
        </a>
      </div>
    </div>
  );
};
