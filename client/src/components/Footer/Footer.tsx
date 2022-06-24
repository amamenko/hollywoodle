import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { ReactComponent as TMDBLogo } from "../../assets/TMDBLogo.svg";
import { BsGithub } from "react-icons/bs";
import "./Footer.scss";

export const Footer = () => {
  const { darkMode } = useContext(AppContext);
  const [browserWidth, changeBrowserWidth] = useState(
    Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
  );

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
      changeBrowserWidth(currentWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return (
    // <!-- Ezoic - bottom_of_page - bottom_of_page -->
    <div className={`footer_container ${darkMode ? "dark" : ""}`}>
      {/* <!-- Ezoic - bottom_of_page - bottom_of_page --> */}
      {browserWidth < 768 && <div id="ezoic-pub-ad-placeholder-106"></div>}
      {/* <!-- End Ezoic - bottom_of_page - bottom_of_page --> */}
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
    // <!-- End Ezoic - bottom_of_page - bottom_of_page -->
  );
};
