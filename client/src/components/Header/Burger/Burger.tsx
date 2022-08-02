import { useContext, useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import {
  IoFootstepsOutline,
  // IoNewspaperOutline
} from "react-icons/io5";
import { GrContact } from "react-icons/gr";
import { ReactComponent as LogoWhite } from "../../../assets/LogoWhite.svg";
import { ReactComponent as LogoStars } from "../../../assets/LogoVariants/Stars/LogoStarsBurger.svg";
import { ReactComponent as LogoJuneteenth } from "../../../assets/LogoVariants/Juneteenth/LogoJuneteenthBurger.svg";
import KofiButton from "kofi-button";
import { toast } from "react-toastify";
import { AppContext } from "../../../App";
import { BiHeart } from "react-icons/bi";
import { TwitterFollowButton } from "../../Winner/TwitterFollowButton";
import Switch from "react-switch";
// import { GiTargetArrows } from "react-icons/gi";
import "./Burger.scss";
import "../Header.scss";

export const Burger = ({
  burgerMenuOpen,
  changeBurgerMenuOpen,
  changeShowContactModal,
  changeShowSupportModal,
}: {
  burgerMenuOpen: boolean;
  changeBurgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  changeShowContactModal: React.Dispatch<React.SetStateAction<boolean>>;
  changeShowSupportModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { darkMode, changeDarkMode, changeShowTopPathsModal, currentHoliday } =
    useContext(AppContext);

  const handleChange = () => {
    changeDarkMode(!darkMode);
  };

  const handleDismissModal = () => changeBurgerMenuOpen(false);

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (burgerMenuOpen) toast.dismiss();
  }, [burgerMenuOpen]);

  return (
    <Menu
      isOpen={burgerMenuOpen}
      onOpen={() => changeBurgerMenuOpen(true)}
      onClose={handleDismissModal}
      disableAutoFocus
      customBurgerIcon={<FiMenu className="burger_icon" color="#fff" />}
      customCrossIcon={<AiOutlineClose color="#fff" />}
    >
      <span className="hollywoodle_logo_container_burger">
        ""
        {currentHoliday === "Memorial Day" ||
        currentHoliday === "Independence Day" ? (
          <LogoStars className="hollywoodle_logo burger_menu" />
        ) : currentHoliday === "Juneteenth" ? (
          <LogoJuneteenth className="hollywoodle_logo burger_menu" />
        ) : (
          <LogoWhite className="hollywoodle_logo burger_menu" />
        )}
      </span>
      <div className="burger_menu_item_container">
        <Link to="/" className="menu-item" onClick={handleDismissModal}>
          <AiOutlineHome size={25} />
          <p>Home</p>
        </Link>
        <Link
          to="/paths"
          className="menu-item"
          onClick={() => {
            changeBurgerMenuOpen(false);
            changeShowTopPathsModal(true);
          }}
        >
          <IoFootstepsOutline className="contact_icon" size={25} />
          <p>All Paths</p>
        </Link>
        {/* <Link
          to="/battle"
          className="menu-item"
          onClick={() => {
            changeBurgerMenuOpen(false);
          }}
        >
          <GiTargetArrows className="contact_icon" size={25} />
          <p>Battle</p>
        </Link> */}
        {/* <Link
          to="/news"
          className="menu-item"
          onClick={() => {
            changeBurgerMenuOpen(false);
          }}
        >
          <IoNewspaperOutline className="contact_icon" size={25} />
          <p>News</p>
        </Link> */}
        <Link
          to="/contact"
          className="menu-item"
          onClick={() => {
            changeBurgerMenuOpen(false);
            changeShowContactModal(true);
          }}
        >
          <GrContact className="contact_icon" size={20} />
          <p>Contact</p>
        </Link>
        <div
          className="menu-item"
          onClick={() => {
            changeBurgerMenuOpen(false);
            changeShowSupportModal(true);
          }}
        >
          <BiHeart className="contact_icon" size={25} />
          <p>Support</p>
        </div>
        <div className="menu-item set_dark_mode">
          <label>
            <Switch
              className="react-switch"
              onChange={handleChange}
              checked={darkMode}
              checkedIcon={false}
              uncheckedIcon={false}
            />
          </label>
          <p>Night Mode</p>
        </div>
      </div>
      <div className="kofi_button_container">
        <KofiButton
          color="#0a9396"
          title="Support on Ko-fi"
          kofiID="E1E3CFTNF"
        />
      </div>
      <TwitterFollowButton buttonText="@hollywoodlegame" />
      <ul className="policies_container">
        <li onClick={handleDismissModal}>
          <Link to={"/privacy"}>Privacy Policy</Link>
        </li>
        <li onClick={handleDismissModal}>
          <Link to={"/terms"}>Terms of Use</Link>
        </li>
      </ul>
      <div className="burger_other_projects_container">
        <p className="main_statement">
          Other movie projects from the creator of Hollywoodle:
        </p>
        <div className="other_project_container">
          <h2>
            <a
              href="https://owen-wilson-wow-api.herokuapp.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              The Owen Wilson Wow API
            </a>
          </h2>
          <p>A database of Owen Wilson's "wow" exclamations in movies.</p>
        </div>
        <div className="other_project_container">
          <h2>
            <a
              href="https://twitter.com/BreakingCasting"
              rel="noopener noreferrer"
              target="_blank"
            >
              @BreakingCastingNews
            </a>
          </h2>
          <p>
            A Twitter bot that tweets fake movie remake casting announcements
            every 4 hours.
          </p>
        </div>
      </div>
    </Menu>
  );
};
