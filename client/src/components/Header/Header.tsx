import { useContext } from "react";
import { AppContext } from "../../App";
import { ReactComponent as LogoWhite } from "../../assets/LogoWhite.svg";
import { HowToPlayModal } from "../HowToPlayModal/HowToPlayModal";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import "./Header.scss";

export const Header = () => {
  const { currentMoves, darkMode, changeDarkMode } = useContext(AppContext);

  const toggleLightDarkMode = () => {
    changeDarkMode(!darkMode);
  };

  return (
    <div className={`header ${darkMode ? "dark" : ""}`}>
      <div className="inner_header_container">
        <HowToPlayModal />
        <LogoWhite className="hollywoodle_logo" />
        {darkMode ? (
          <MdDarkMode
            className="light_dark_mode_icon"
            color={"#fff"}
            size={25}
            onClick={toggleLightDarkMode}
          />
        ) : (
          <MdOutlineDarkMode
            className="light_dark_mode_icon"
            color={"#fff"}
            size={25}
            onClick={toggleLightDarkMode}
          />
        )}
      </div>
      <div className={`points_container ${darkMode ? "dark" : ""}`}>
        Total Moves: {currentMoves}
      </div>
    </div>
  );
};
