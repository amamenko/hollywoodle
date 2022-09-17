import gradient from "random-gradient";
import { useRef } from "react";
import emoji from "react-easy-emoji";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { getRandomEmoji } from "./getRandomEmoji";

export const IndividualComment = ({ id }: { id: string }) => {
  const bgGradient = { background: gradient(id) };
  const randomEmoji = useRef(getRandomEmoji()).current;
  return (
    <div className="individual_comment_container">
      <div className="individual_comment_top_details">
        <div className="individual_comment_icon_container">
          <p>{emoji(randomEmoji)}</p>
          <span className="individual_comment_icon" style={bgGradient} />
        </div>
        <div className="individual_comment_text_container">
          <p className="individual_comment_text">
            Lorem ipsum dolor sit amet lorem ipsum dolor sit amet ipsum dolor
            sit amet lorem ipsum dolor sit amet ipsum dolor sit amet lorem ipsum
            dolor sit amet ipsum dolor sit amet lorem ipsum dolor sit amet
          </p>
        </div>
      </div>
      <div className="individual_comment_bottom_details">
        <div className="indvidual_comment_date_place">
          <p>43m ago</p>
          <div className="individual_comment_place">
            <p>
              Finland<span className="country_state_separator_line">|</span>
              Helsinki
            </p>
          </div>
        </div>
        <div className="comment_voting_buttons">
          <IoIosArrowDropup className="comment_voting_button" size={40} />
          <p>0</p>
          <IoIosArrowDropdown className="comment_voting_button" size={40} />
        </div>
      </div>
    </div>
  );
};
