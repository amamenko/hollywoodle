import { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import Collapsible from "react-collapsible";

export const CollapsibleArchive = ({ date }: { date: string }) => {
  const [collapseOpen, changeCollapseOpen] = useState(false);

  const collapseTriggerElement = () => {
    return (
      <div
        className="collapse_trigger_element"
        onClick={() => changeCollapseOpen(!collapseOpen)}
      >
        <h2>{date}</h2>
        <IoIosArrowDropdownCircle
          className={`collapse_caret ${collapseOpen ? "open" : ""}`}
          size={20}
        />
      </div>
    );
  };

  return (
    <Collapsible trigger={collapseTriggerElement()}>
      <p>
        This is the collapsible content. It can be any element or React
        component you like.
      </p>
      <p>
        It can even be another Collapsible component. Check out the next
        section!
      </p>
    </Collapsible>
  );
};
