import { GrTwitter } from "react-icons/gr";

export const TwitterFollowButton = ({
  buttonText,
  win,
}: {
  buttonText: string;
  win?: boolean;
}) => (
  <div className="winner_kofi_button">
    <div className="btn-container">
      <a
        className={`kofi-button twitter ${win ? "win" : ""}`}
        href="https://twitter.com/hollywoodlegame"
        target="_blank"
        rel="noreferrer noopener"
        title="Follow Hollywoodle's Twitter page @hollywoodlegame"
      >
        <span className="kofitext">
          <GrTwitter className="kofiimg" size={18} />
          {buttonText}
        </span>
      </a>
    </div>
  </div>
);
