import { useContext, useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import { IoFootstepsOutline } from "react-icons/io5";
import { GrContact } from "react-icons/gr";
import { ReactComponent as LogoWhite } from "../../../assets/LogoWhite.svg";
import KofiButton from "kofi-button";
import { toast } from "react-toastify";
import { AppContext } from "../../../App";
import { BiHeart } from "react-icons/bi";
import Switch from "react-switch";
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
  const { darkMode, changeDarkMode, changeShowTopPathsModal } =
    useContext(AppContext);
  const [checked, changeChecked] = useState(true);

  const handleChange = (checked: boolean) => {
    changeDarkMode(!darkMode);
    changeChecked(checked);
  };

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (burgerMenuOpen) toast.dismiss();
  }, [burgerMenuOpen]);

  return (
    <Menu
      isOpen={burgerMenuOpen}
      onOpen={() => changeBurgerMenuOpen(true)}
      onClose={() => changeBurgerMenuOpen(false)}
      disableAutoFocus
      customBurgerIcon={<FiMenu className="burger_icon" color="#fff" />}
      customCrossIcon={<AiOutlineClose color="#fff" />}
    >
      <span className="hollywoodle_logo_container_burger">
        ""
        <LogoWhite className="hollywoodle_logo burger_menu" />
      </span>
      <div className="burger_menu_item_container">
        <div className="menu-item" onClick={() => changeBurgerMenuOpen(false)}>
          <AiOutlineHome size={25} />
          <p>Home</p>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            changeBurgerMenuOpen(false);
            changeShowTopPathsModal(true);
          }}
        >
          <IoFootstepsOutline className="contact_icon" size={25} />
          <p>Top Paths</p>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            changeBurgerMenuOpen(false);
            changeShowContactModal(true);
          }}
        >
          <GrContact className="contact_icon" size={20} />
          <p>Contact</p>
        </div>
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
              checked={checked}
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