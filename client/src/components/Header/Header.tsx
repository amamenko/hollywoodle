import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { ReactComponent as LogoWhite } from "../../assets/LogoWhite.svg";
import { HowToPlayModal } from "../HowToPlayModal/HowToPlayModal";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";
import { Statistics } from "./Statistics";
import "./Header.scss";

export const Header = () => {
  const { currentMoves, darkMode, changeDarkMode } = useContext(AppContext);
  const [modalOpen, changeModalOpen] = useState(false);

  const toggleLightDarkMode = () => {
    changeDarkMode(!darkMode);
  };

  const openModal = () => {
    changeModalOpen(true);
  };

  const closeModal = () => {
    changeModalOpen(false);
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
        <BiBarChartAlt2
          className="header_graph_icon"
          color={"#fff"}
          size={25}
          onClick={openModal}
        />
        <Statistics modalOpen={modalOpen} closeModal={closeModal} />
      </div>
      <div className={`points_container ${darkMode ? "dark" : ""}`}>
        Total Moves: {currentMoves}
      </div>
    </div>
  );
};
