import { useContext } from "react";
// import { useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { Footer } from "../../../components/Footer/Footer";
import { BackButton } from "../../BackButton";
import ContentLoader from "react-content-loader";
import "./Article.scss";

const ArticleLoader = ({ darkMode }: { darkMode: boolean }) => (
  <ContentLoader
    speed={1}
    width={800}
    viewBox="0 0 800 1500"
    backgroundColor={darkMode ? "rgb(145, 146, 146)" : "rgb(215, 216, 217)"}
    foregroundColor={darkMode ? "rgb(115, 115, 115)" : "rgb(208, 208, 208)"}
  >
    <rect x="42" y="57" rx="4" ry="4" width="417" height="29" />
    <rect x="42" y="105" rx="4" ry="4" width="67" height="15" />
    <rect x="217" y="157" rx="4" ry="4" width="433" height="291" />
    <rect x="48" y="515" rx="4" ry="4" width="720" height="15" />
    <rect x="49" y="547" rx="4" ry="4" width="598" height="15" />
    <rect x="48" y="581" rx="4" ry="4" width="720" height="15" />
    <rect x="49" y="612" rx="4" ry="4" width="520" height="15" />
    <rect x="48" y="652" rx="4" ry="4" width="720" height="15" />
    <rect x="48" y="684" rx="4" ry="4" width="598" height="15" />
    <rect x="48" y="718" rx="4" ry="4" width="720" height="15" />
    <rect x="49" y="748" rx="4" ry="4" width="419" height="15" />
  </ContentLoader>
);

export const Article = () => {
  // let { topicId } = useParams();
  const { darkMode } = useContext(AppContext);

  return (
    <div className={`news_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`news_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton />
        HOLLYWOODLE NEWS
      </h2>
      <div className="loader_container">
        <ArticleLoader darkMode={darkMode} />
      </div>
      {/* <div className="article_container">
        <h2 className="article_title">WELCOME TO HOLLYWOODLE</h2>
        <div className="article_details">
          <p className="article_date">04/01/2022</p>
          <p className="details_divider">|</p>
          <p>Game Updates</p>
        </div>
        <div className="article_image_container">
          <img
            src="https://i.imgur.com/aDTTMs8.png"
            alt="WELCOME TO HOLLYWOODLE"
          />
        </div>
      </div> */}
      <Footer />
    </div>
  );
};
