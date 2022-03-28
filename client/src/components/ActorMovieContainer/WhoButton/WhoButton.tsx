import { useContext, useState } from "react";
import { Collapse } from "react-collapse";
import { Button } from "reactstrap";
import { AppContext } from "../../../App";
import "./WhoButton.scss";

export const WhoButton = ({
  knownFor,
  gender,
}: {
  knownFor: { [key: string]: string | number };
  gender: string;
}) => {
  const { currentPoints, changeCurrentPoints, win } = useContext(AppContext);
  const [collapse, changeCollapse] = useState(false);

  const toggleCollapse = () => {
    if (!collapse && !win) {
      changeCollapse(true);
      changeCurrentPoints(currentPoints + 30);
    }
  };

  if (!win) {
    return (
      <div className="who_button_container">
        {!collapse && (
          <p>
            Stuck? <b>(+30 points)</b>
          </p>
        )}
        <Button
          className={`who_button ${collapse ? "active" : ""}`}
          id="who_button"
          onClick={toggleCollapse}
        >
          GET A HINT
        </Button>
        <Collapse
          isOpened={collapse}
          initialStyle={{ height: 0, overflow: "hidden" }}
        >
          <div className="collapse_container">
            <span>
              {gender === "male"
                ? "His"
                : gender === "female"
                ? "Her"
                : "Their"}{" "}
              most popular recent role was the character of{" "}
              <b>"{knownFor.character}"</b> in the <b>{knownFor.year}</b> film{" "}
              <b>{knownFor.title}</b>.
            </span>
          </div>
        </Collapse>
      </div>
    );
  } else {
    return <></>;
  }
};
