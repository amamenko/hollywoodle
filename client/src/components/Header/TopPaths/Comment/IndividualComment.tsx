import gradient from "random-gradient";
import emoji from "react-easy-emoji";
import { getRandomEmoji } from "./getRandomEmoji";

export const IndividualComment = ({ id }: { id: string }) => {
  const bgGradient = { background: gradient(id) };
  const randomEmoji = getRandomEmoji();
  return (
    <div className="individual_comment_container">
      <div className="individual_comment_icon_container">
        <p>{emoji(randomEmoji)}</p>
        <span className="individual_comment_icon" style={bgGradient} />
      </div>
      <div className="individual_comment_text_container">
        <p className="individual_comment_text">
          Lorem ipsum dolor sit amet lorem ipsum dolor sit amet ipsum dolor sit
          amet lorem ipsum dolor sit amet ipsum dolor sit amet lorem ipsum dolor
          sit amet ipsum dolor sit amet lorem ipsum dolor sit amet
        </p>
      </div>
    </div>
  );
};
