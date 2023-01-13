import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import { NewsObj } from "../../../interfaces/News.interfaces";
import { GoTriangleLeft, GoTriangleUp } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { scroller, Element } from "react-scroll";
import { ShareButton } from "../../../components/Winner/NewButtons/ShareButton";
import { ShareViaTweet } from "../../../components/Winner/NewButtons/ShareViaTweet";

export const FullArticle = ({
  currentArticle,
}: {
  currentArticle: NewsObj;
}) => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();
  const [shareLinkClicked, changeShareLinkClicked] = useState(false);
  const [shareLinkAnimatingOut, changeShareLinkAnimatingOut] = useState(false);
  const [lastClicked, changeLastClicked] = useState("");
  const navigate = useNavigate();
  const handleNavigateBack = () => {
    const linKState = location.state as { [key: string]: number };
    const pageState = linKState.page;
    if (pageState) {
      navigate(`/news?page=${pageState}`);
    } else {
      navigate("/news");
    }
  };
  const fullArticleLink = `https://hollywoodle.vercel.app/news/${currentArticle.slug}`;
  const handleScrollToTop = () => {
    scroller.scrollTo("top", {
      duration: 500,
      offset: -200,
      smooth: true,
      container: "article_container",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleAnimateOutTimeout = (
      clickedFn: (value: React.SetStateAction<boolean>) => void,
      animatingOutFn: (value: React.SetStateAction<boolean>) => void
    ) => {
      setTimeout(() => {
        animatingOutFn(true);
      }, 4500);

      setTimeout(() => {
        clickedFn(false);
        animatingOutFn(false);
      }, 4800);
    };

    if (lastClicked === "link" && shareLinkClicked) {
      handleAnimateOutTimeout(
        changeShareLinkClicked,
        changeShareLinkAnimatingOut
      );
    }
  }, [lastClicked, shareLinkClicked]);

  return (
    <Element name="top" className="article_container">
      <h2 className="article_title">{currentArticle.title.toUpperCase()}</h2>
      <div className="article_details">
        <p className="article_date">{currentArticle.date}</p>
        <p className="details_divider">|</p>
        <p>{currentArticle.category}</p>
      </div>
      <div className="article_image_container">
        <img src={currentArticle.image} alt={currentArticle.title} />
      </div>
      <div
        className={`article_share_buttons_container ${darkMode ? "dark" : ""}`}
      >
        <ShareButton
          shareLinkClicked={shareLinkClicked}
          changeShareLinkClicked={changeShareLinkClicked}
          changeLastClicked={changeLastClicked}
          shareLinkAnimatingOut={shareLinkAnimatingOut}
          copyShareLink={`${fullArticleLink}`}
        />
        <ShareViaTweet
          twitterShareText={`${currentArticle.title}\n${fullArticleLink} via @hollywoodlegame`}
        />
      </div>
      <div className={`article_text_container ${darkMode ? "dark" : ""}`}>
        <span dangerouslySetInnerHTML={{ __html: currentArticle.text }} />
        <div className="article_bottom_container">
          <span
            className={`article_read_more_news ${darkMode ? "dark" : ""}`}
            onClick={handleNavigateBack}
          >
            <GoTriangleLeft size={25} /> More news
          </span>
          <span
            className={`article_back_to_top ${darkMode ? "dark" : ""}`}
            onClick={handleScrollToTop}
          >
            Back to top <GoTriangleUp size={25} />
          </span>
        </div>
      </div>
    </Element>
  );
};
