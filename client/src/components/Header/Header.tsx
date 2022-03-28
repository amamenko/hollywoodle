import { useContext } from "react";
import { AppContext } from "../../App";
import { ReactComponent as LogoWhite } from "../../assets/LogoWhite.svg";
import { HowToPlayModal } from "../HowToPlayModal/HowToPlayModal";
import "./Header.scss";

export const Header = () => {
  const { currentPoints } = useContext(AppContext);

  return (
    <div className="header">
      <div className="inner_header_container">
        <HowToPlayModal />
        <LogoWhite className="hollywoodle_logo" />
      </div>
      <div className="points_container">Current points: {currentPoints}</div>
    </div>
  );
};
