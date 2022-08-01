import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { Footer } from "../../components/Footer/Footer";
import { BackButton } from "../BackButton";
import { Button } from "reactstrap";
import "./Battle.scss";

export const Battle = () => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();
  //   const [displayName, changeDisplayName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (location.pathname === "/battle") toast.dismiss();
  }, [location]);

  return (
    <div className={`battle_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`battle_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton />
        HOLLYWOODLE BATTLE
      </h2>
      <div className="battle_input_section">
        <div className={`contact_input_container ${darkMode ? "dark" : ""}`}>
          <label htmlFor="username_field">Display name</label>
          <input
            className="form-control"
            type="text"
            name="username"
            id="username_field"
            aria-describedby="username"
            maxLength={15}
            // onChange={(e) => changeDisplayName(e.target.value)}
          />
        </div>
        <div className="submit_button_container">
          <Button
            type="submit"
            className={`guess_button ${darkMode ? "dark" : ""}`}
          >
            <span>ENTER PLAY AREA</span>
          </Button>
        </div>
      </div>
      <div className="battle_prompt">
        <p>Welcome to a multiplayer version of Hollywoodle.</p>
        <p>
          Create a private or public room or join an existing room. Each match
          features a starting actor or movie of your choosing. Players take
          turns guessing connecting actors or movies.
        </p>
        <p>Try to out-guess your opponents before the clock runs out!</p>
        <p>Think your opponent’s just playing a role?</p>
        <p>
          If you think they couldn’t name a movie with the actor they just
          played or an actor in the movie they just played, hit the{" "}
          <b>challenge</b> button — if they can't, you win the match - but be
          careful: if they can beat your challenge and prove they know their
          stuff, you lose the match!
        </p>
      </div>

      <Footer />
    </div>
  );
};
