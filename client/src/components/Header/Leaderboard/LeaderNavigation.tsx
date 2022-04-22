import { useRef, useState } from "react";
import { Button } from "reactstrap";
import { Collapse } from "react-collapse";
import { Form, FormGroup, Input, FormFeedback, FormText } from "reactstrap";
import { cuss } from "cuss";
import "./Leaderboard.scss";
import { exceptedArr } from "./exceptedArr";

export const LeaderNavigation = ({
  changeLeaderboardPage,
}: {
  changeLeaderboardPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [usernameCollapsed, changeUsernameCollapsed] = useState(false);
  const [usernameInput, changeUsernameInput] = useState("");
  const [usernameInvalid, changeUsernameInvalid] = useState(false);

  const inputElement = useRef<HTMLInputElement | null>(null);

  const validateUsername = () => {
    const allCussWordEntries = Object.entries(cuss).filter((el) => el[1] >= 1);
    const newCussObj = Object.fromEntries(allCussWordEntries);

    const allFilteredCussWordsArr = Object.keys(newCussObj).filter(
      (el) => !exceptedArr.includes(el)
    );

    if (
      allFilteredCussWordsArr.some((el) =>
        usernameInput.toLowerCase().includes(el)
      )
    ) {
      changeUsernameInvalid(true);
    }
  };

  const handleUsernameButton = () => {
    if (inputElement.current) inputElement.current.focus();
    changeUsernameCollapsed(!usernameCollapsed);
  };

  const handleUsernameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (usernameInvalid) changeUsernameInvalid(false);
    changeUsernameInput(
      e.target.value.toUpperCase().replace(/[^a-z0-9]/gim, "")
    );
  };

  return (
    <div className="leadboard_navigation_container">
      <p className="leaderboard_disclaimer ">
        The Hollywoodle leaderboard is reserved for the day's best players.
        <br />
        <br />
        The fewer your moves and the sooner you complete the actor connection
        after the game restarts at 12 AM Eastern Time, the more likely your
        chances are of having your name up in lights!
      </p>
      <div className="leadboard_navigation_buttons">
        <Button className={"who_button"} onClick={handleUsernameButton}>
          ADD USERNAME
        </Button>
        <Collapse
          isOpened={usernameCollapsed}
          initialStyle={{ height: 0, overflow: "hidden" }}
        >
          <Form className="autosuggest_input_container leaderboard_username_input_container">
            <FormGroup className="leaderboard_username_inner_container">
              <Input
                autoFocus
                innerRef={inputElement}
                type="text"
                className="autosuggest_input form-control dark"
                value={usernameInput}
                maxLength={12}
                onChange={handleUsernameInputChange}
                invalid={usernameInvalid}
              />
              <FormFeedback>
                Whoa! What do you think this is, a Tarantino movie? Keep it G,
                keep it light.
              </FormFeedback>
              <FormText>
                Usernames must contain at least 5 characters and no more than 12
                characters. They must also contain at least 4 letters.
              </FormText>
            </FormGroup>
          </Form>
          <Button
            className={`guess_button dark leaderboard_set_username ${
              (usernameInput.replace(/\d/gim, "").length < 4 ||
                usernameInput.length < 5 ||
                usernameInput.length > 12 ||
                usernameInvalid) &&
              "invalid"
            }`}
            onClick={validateUsername}
          >
            SET AS USERNAME
          </Button>
        </Collapse>
        <Button
          className={"who_button"}
          onClick={() => changeLeaderboardPage("today")}
        >
          SEE TODAY'S LEADERBOARD
        </Button>
      </div>
    </div>
  );
};
