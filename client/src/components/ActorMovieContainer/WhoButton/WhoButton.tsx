import { useState } from "react";
import { Collapse } from "react-collapse";
import { Button } from "reactstrap";
import "./WhoButton.scss";

export const WhoButton = () => {
  const [collapse, changeCollapse] = useState(false);

  const toggleCollapse = () => {
    changeCollapse(!collapse);
  };

  return (
    <>
      <Button onClick={toggleCollapse}>GET A HINT +30 POINTS</Button>
      <Collapse
        isOpened={collapse}
        initialStyle={{ height: 0, overflow: "hidden" }}
      >
        <div className="collapse_container">Random content</div>
      </Collapse>
    </>
  );
};
