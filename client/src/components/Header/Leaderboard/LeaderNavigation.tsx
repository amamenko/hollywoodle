import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { Collapse } from "react-collapse";
import { Form, FormGroup, Input, FormFeedback, FormText } from "reactstrap";
import { cuss } from "cuss";
import { exceptedArr } from "./exceptedArr";
import * as Ladda from "ladda";
import { AppContext } from "../../../App";
import isMobile from "ismobilejs";
import "./Leaderboard.scss";
import "ladda/dist/ladda.min.css";

export const LeaderNavigation = ({
  changeLeaderboardPage,
}: {
  changeLeaderboardPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const currentIsMobile = isMobile();

  const { fullTimezoneDate, objectiveCurrentDate } = useContext(AppContext);
  const [usernameCollapsed, changeUsernameCollapsed] = useState(false);
  const [usernameInput, changeUsernameInput] = useState("");
  const [usernameInvalid, changeUsernameInvalid] = useState(false);
  const [usernameAllowChange, changeUsernameAllowChange] = useState(true);
  const [currentActiveUsername, changeCurrentActiveUsername] = useState("");
  const [foundCussWord, changeFoundCussWord] = useState("");
  const [criteriaOpened, changeCriteriaOpened] = useState(false);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const laddaRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const storageStr = localStorage.getItem("hollywoodle-statistics");
    let storageObj: { [key: string]: number | number[] } = {};

    try {
      storageObj = JSON.parse(storageStr ? storageStr : "");
    } catch (e) {
      console.error(e);
    }

    if (storageObj.username && !currentActiveUsername) {
      changeCurrentActiveUsername(storageObj.username.toString());
      changeUsernameAllowChange(false);
    }

    const currentTime = new Date().getTime();
    if (storageObj.username_can_be_changed) {
      if (currentTime > storageObj.username_can_be_changed) {
        if (!usernameAllowChange) {
          changeUsernameAllowChange(true);
        }
      }
    }
  }, [currentActiveUsername, usernameAllowChange]);

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
      const foundWord = allFilteredCussWordsArr.find((el) =>
        usernameInput.toLowerCase().includes(el)
      );
      if (foundWord) changeFoundCussWord(foundWord);
      changeUsernameInvalid(true);
    } else {
      const storageStr = localStorage.getItem("hollywoodle-statistics");
      let storageObj: { [key: string]: number | number[] } = {};

      try {
        storageObj = JSON.parse(storageStr ? storageStr : "");
      } catch (e) {
        console.error(e);
      }

      const numWeeks = 2;
      let now = new Date();
      const twoWeeksFromNow = now.setDate(now.getDate() + numWeeks * 7);

      if (storageObj) {
        localStorage.setItem(
          "hollywoodle-statistics",
          JSON.stringify({
            ...storageObj,
            username: usernameInput,
            username_can_be_changed: twoWeeksFromNow,
            leaderboard_viewed: storageObj.leaderboard_viewed
              ? storageObj.leaderboard_viewed.toString() ===
                objectiveCurrentDate
                ? objectiveCurrentDate
                : ""
              : "",
            leaderboard_eligible: storageObj.leaderboard_viewed
              ? storageObj.leaderboard_viewed.toString() ===
                objectiveCurrentDate
                ? false
                : true
              : true,
          })
        );
      }

      changeCurrentActiveUsername(usernameInput);
      changeUsernameCollapsed(false);
      changeUsernameAllowChange(false);
    }
  };

  const handleLaddaClick = () => {
    if (laddaRef && laddaRef.current) {
      let l = Ladda.create(laddaRef.current);
      l.start();
      setTimeout(() => {
        validateUsername();
        l.stop();
        l.remove();
      }, 500);
    }
  };

  const handleUsernameButton = () => {
    // Only auto-focus input on non-mobile devices
    if (!currentIsMobile.any) {
      if (inputElement.current) inputElement.current.focus();
    }
    changeUsernameCollapsed(!usernameCollapsed);
  };

  const handleUsernameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (usernameInvalid) changeUsernameInvalid(false);
    if (foundCussWord) changeFoundCussWord("");
    changeUsernameInput(
      e.target.value.toUpperCase().replace(/[^a-z0-9]/gim, "")
    );
  };

  return (
    <div className="leadboard_navigation_container">
      <p className="leaderboard_disclaimer">
        The Hollywoodle leaderboard is reserved for the day's best players. The
        most efficient user paths are displayed here.
        <br />
        <br />
        The fewer your moves and the sooner you complete the actor connection
        after the game restarts at 12:00 AM Eastern Time
        {fullTimezoneDate.includes("12:00 AM") ? "" : ` or ${fullTimezoneDate}`}
        , the more likely your chances are of having your name up in lights!
        <br />
        <br />
        <span
          className="leaderboard_eligibility_toggle_view"
          onClick={() => changeCriteriaOpened(!criteriaOpened)}
        >
          View eligibility criteria
        </span>
      </p>
      <Collapse
        isOpened={criteriaOpened}
        initialStyle={{ height: 0, overflow: "hidden" }}
      >
        <p className="leaderboard_disclaimer criteria">
          The criteria for leaderboard eligibility are as follows:
        </p>
        <ul className="leaderboard_disclaimer">
          <li>Must have a username.</li>
          <li>Must be playing today's game for the first time today.</li>
          <li>
            Must not have already looked at any other player's leadboard path.
          </li>
        </ul>
      </Collapse>

      <div className="leadboard_navigation_buttons">
        {currentActiveUsername && (
          <>
            <p>Your username is:</p>
            <h2>{currentActiveUsername}</h2>
          </>
        )}
        <Button
          className={`who_button leaderboard_set_username ${
            usernameAllowChange ? "" : "invalid"
          }`}
          onClick={handleUsernameButton}
        >
          {currentActiveUsername ? "CHANGE" : "ADD"} USERNAME
        </Button>
        <Collapse
          isOpened={usernameCollapsed}
          initialStyle={{ height: 0, overflow: "hidden" }}
        >
          <Form className="autosuggest_input_container leaderboard_username_input_container">
            <FormGroup className="leaderboard_username_inner_container">
              <p className="leaderboard_username_disclaimer">
                Your username can only be changed <b>once</b> every <b>two</b>{" "}
                weeks, so make it a good one!
              </p>
              <Input
                innerRef={inputElement}
                type="text"
                className="autosuggest_input form-control dark"
                value={usernameInput}
                maxLength={12}
                onChange={handleUsernameInputChange}
                invalid={usernameInvalid}
              />
              <FormFeedback>
                Whoa! What do you think this is, a Tarantino movie?
                <br />
                <br />
                {foundCussWord
                  ? `You can't have a username with the term "${foundCussWord.toUpperCase()}."`
                  : ""}{" "}
                Keep it G, keep it light.
              </FormFeedback>
              <FormText>
                Usernames must contain at least 5 characters and no more than 12
                characters. They must also contain at least 4 letters.
              </FormText>
            </FormGroup>
          </Form>
          <button
            className={`guess_button ladda-button dark leaderboard_set_username ${
              (usernameInput.replace(/\d/gim, "").length < 4 ||
                usernameInput.length < 5 ||
                usernameInput.length > 12 ||
                usernameInvalid) &&
              "invalid"
            }`}
            data-style="expand-right"
            ref={laddaRef}
            onClick={handleLaddaClick}
          >
            <span className="ladda-label">CONFIRM USERNAME</span>
          </button>
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
