import { useContext } from "react";
import { AppContext } from "../../../App";
import ContentLoader from "react-content-loader";

const ArticleLoader = ({ darkMode }: { darkMode: boolean }) => (
  <ContentLoader
    speed={1}
    width={810}
    viewBox="0 0 810 1200"
    backgroundColor={darkMode ? "rgb(145, 146, 146)" : "rgb(215, 216, 217)"}
    foregroundColor={darkMode ? "rgb(115, 115, 115)" : "rgb(208, 208, 208)"}
  >
    <rect x="42" y="37" rx="4" ry="4" width="720" height="50" />
    <rect x="42" y="127" rx="4" ry="4" width="167" height="45" />
    <rect x="242" y="127" rx="4" ry="4" width="7" height="45" />
    <rect x="282" y="127" rx="4" ry="4" width="167" height="45" />
    <rect x="42" y="217" rx="4" ry="4" width="720" height="391" />
    <rect x="48" y="655" rx="4" ry="4" width="720" height="30" />
    <rect x="48" y="705" rx="4" ry="4" width="720" height="30" />
    <rect x="48" y="755" rx="4" ry="4" width="720" height="30" />
    <rect x="49" y="805" rx="4" ry="4" width="520" height="30" />
    <rect x="48" y="875" rx="4" ry="4" width="598" height="30" />
    <rect x="48" y="925" rx="4" ry="4" width="720" height="30" />
    <rect x="49" y="975" rx="4" ry="4" width="419" height="30" />
  </ContentLoader>
);

export const ArticlePlaceholder = () => {
  const { darkMode } = useContext(AppContext);
  return (
    <div className="loader_container">
      <ArticleLoader darkMode={darkMode} />
    </div>
  );
};
