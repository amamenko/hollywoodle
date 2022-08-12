import { useContext, useEffect } from "react";
import { AppContext } from "../../../App";
import { NewsObj } from "../../../interfaces/News.interfaces";
import { GoTriangleLeft, GoTriangleUp } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { scroller, Element } from "react-scroll";
import { Helmet } from "react-helmet";

export const FullArticle = ({
  currentArticle,
}: {
  currentArticle: NewsObj;
}) => {
  const { darkMode } = useContext(AppContext);
  const navigate = useNavigate();
  // Remove HTML tags from text
  const descriptionSnippet = currentArticle.text
    .replace(/(<([^>]+)>)/gim, "")
    .slice(0, 150);
  const handleNavigateBack = () => navigate("/news");
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

  return (
    <Element name="top" className="article_container">
      <Helmet>
        <title>{`${currentArticle.title} - News - Hollywoodle`}</title>
        <meta
          name="title"
          content={`${currentArticle.title} - News - Hollywoodle`}
        />
        <meta name="description" content={descriptionSnippet} />
        {/* Open Graph / Facebook  */}
        <meta
          property="og:url"
          content={`https://www.hollywoodle.ml/news/${currentArticle.slug}`}
        />
        <meta
          property="og:title"
          content={`${currentArticle.title} - News - Hollywoodle`}
        />
        <meta property="og:description" content={descriptionSnippet} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="314" />
        <meta property="og:image" content={currentArticle.image} />
        {/* Twitter */}
        <meta
          property="twitter:url"
          content={`https://www.hollywoodle.ml/news/${currentArticle.slug}`}
        />
        <meta
          property="twitter:title"
          content={`${currentArticle.title} - News - Hollywoodle`}
        />
        <meta property="twitter:description" content={descriptionSnippet} />
        <meta property="twitter:image" content={currentArticle.image} />
      </Helmet>
      <h2 className="article_title">{currentArticle.title.toUpperCase()}</h2>
      <div className="article_details">
        <p className="article_date">{currentArticle.date}</p>
        <p className="details_divider">|</p>
        <p>{currentArticle.category}</p>
      </div>
      <div className="article_image_container">
        <img src={currentArticle.image} alt={currentArticle.title} />
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
