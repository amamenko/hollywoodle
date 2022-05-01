import { useContext, useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import { GrContact } from "react-icons/gr";
import { ReactComponent as LogoWhite } from "../../../assets/LogoWhite.svg";
import KofiButton from "kofi-button";
import { toast } from "react-toastify";
import { AppContext } from "../../../App";
import "./Burger.scss";
import "../Header.scss";

export const Burger = ({
  burgerMenuOpen,
  changeBurgerMenuOpen,
}: {
  burgerMenuOpen: boolean;
  changeBurgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { darkMode, changeDarkMode } = useContext(AppContext);

  const [checked, changeChecked] = useState(true);
  const offstyle = "btn-danger";
  const onstyle = "btn-success";
  let displayStyle = checked ? onstyle : offstyle;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeDarkMode(!darkMode);
    changeChecked(e.target.checked);
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
      <LogoWhite className="hollywoodle_logo burger_menu" />
      <div className="burger_menu_item_container">
        <div className="menu-item" onClick={() => changeBurgerMenuOpen(false)}>
          <AiOutlineHome size={25} />
          <p>Home</p>
        </div>
        <div className="menu-item">
          <GrContact className="contact_icon" size={20} />
          <p>Contact</p>
        </div>
        <div className="menu-item set_dark_mode">
          <label>
            <span className={"switch-wrapper"}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => handleChange(e)}
              />
              <span className={`${displayStyle} switch`}>
                <span className="switch-handle" />
              </span>
            </span>
          </label>
          <p>Night Mode</p>
        </div>
      </div>
      <div className="kofi_button_container">
        <KofiButton
          color="#0a9396"
          title="Support us on Ko-fi"
          kofiID="H2H0BYJ1R"
        />
      </div>
    </Menu>
  );
};
