import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { Footer } from "../../../components/Footer/Footer";
import { BackButton } from "../../BackButton";
import { ArticlePlaceholder } from "./ArticlePlaceholder";
import { FullArticle } from "./FullArticle";
import axios from "axios";
import { NewsObj } from "../../../interfaces/News.interfaces";
import { loadImage } from "../loadImage";
import { Helmet } from "react-helmet";
import "./Article.scss";

export const Article = () => {
  const location = useLocation();
  let { topicId } = useParams();
  const { darkMode } = useContext(AppContext);
  const [currentArticle, changeCurrentArticle] = useState<NewsObj>({
    _id: "",
    title: "",
    image: "",
    category: "",
    date: "",
    slug: "",
    text: "",
  });
  const [articleLoading, changeArticleLoading] = useState(false);
  const getNavPage = () => {
    const linkState = location.state as { [key: string]: number } | undefined;
    const pageState = linkState ? linkState.page : "";
    if (pageState) {
      return `/news?page=${pageState}`;
    } else {
      return "/news";
    }
  };
  const customNav = getNavPage();

  const descriptionSnippet =
    currentArticle.text
      // Remove HTML tags from text
      .replace(/(<([^>]+)>)/gm, " ")
      // Change double spaces to single space
      .replace(/\s{2,}/gm, " ")
      .trim()
      .slice(0, 125)
      .trim() + "...";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    const fetchData = async () => {
      changeArticleLoading(true);
      await axios
        .get(
          nodeEnv && nodeEnv === "production"
            ? `${process.env.REACT_APP_PROD_SERVER}/api/news_article`
            : "http://localhost:4000/api/news_article",
          {
            params: { slug: topicId },
          }
        )
        .then((res) => res.data)
        .then((data) => {
          if (data) {
            if (
              data.title &&
              data.image &&
              data.category &&
              data.date &&
              data.slug &&
              data.text &&
              data._id
            ) {
              changeCurrentArticle(data);
            }
          }
          Promise.allSettled([loadImage(data.image)])
            .then(() =>
              setTimeout(() => {
                changeArticleLoading(false);
                // Signal to prerender.io service that page has finished rendering
                const newWindow = window as any;
                if (!newWindow.prerenderReady) newWindow.prerenderReady = true;
              }, 300)
            )
            .catch((err) => console.error("Failed to load images", err));
        })
        .catch((e) => {
          setTimeout(() => changeArticleLoading(false), 300);
          console.error(e);
        });
    };

    fetchData();
    return () => source.cancel();
  }, [topicId]);

  return (
    <div className={`news_container ${darkMode ? "dark" : ""}`}>
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
      <h2 className={`news_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton customNav={customNav} />
        HOLLYWOODLE NEWS
      </h2>
      {articleLoading ? (
        <ArticlePlaceholder />
      ) : (
        <FullArticle currentArticle={currentArticle} />
      )}
      <Footer />
    </div>
  );
};
