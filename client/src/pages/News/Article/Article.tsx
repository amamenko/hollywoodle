import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { Footer } from "../../../components/Footer/Footer";
import { BackButton } from "../../BackButton";
import { ArticlePlaceholder } from "./ArticlePlaceholder";
import { FullArticle } from "./FullArticle";
import axios from "axios";
import { NewsObj } from "../../../interfaces/News.interfaces";
import "./Article.scss";

export const Article = () => {
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
          setTimeout(() => changeArticleLoading(false), 300);
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
      <h2 className={`news_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton customNav={"/news"} />
        HOLLYWOODLE NEWS
      </h2>
      {articleLoading || !currentArticle.title || !currentArticle._id ? (
        <ArticlePlaceholder />
      ) : (
        <FullArticle currentArticle={currentArticle} />
      )}
      <Footer />
    </div>
  );
};
