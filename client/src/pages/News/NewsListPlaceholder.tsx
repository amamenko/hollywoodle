import { useContext } from "react";
import ContentLoader from "react-content-loader";
import { AppContext } from "../../App";

const NewsLoader = ({ darkMode }: { darkMode: boolean }) => (
  <ContentLoader
    speed={1}
    animate={true}
    viewBox="0 0 375 100"
    title="Loading news..."
    backgroundColor={darkMode ? "rgb(145, 146, 146)" : "rgb(215, 216, 217)"}
    foregroundColor={darkMode ? "rgb(115, 115, 115)" : "rgb(208, 208, 208)"}
  >
    <rect x="0.84" y="9.93" rx="5" ry="5" width="145.55" height="80.59" />
    <rect x="158.84" y="20.67" rx="0" ry="0" width="148.72" height="12.12" />
    <rect x="158.84" y="46.67" rx="0" ry="0" width="89" height="9" />
    <rect x="258.84" y="46.67" rx="0" ry="0" width="40" height="9" />
    <rect x="158.84" y="71.67" rx="0" ry="0" width="89" height="9" />
    <rect x="258.84" y="71.67" rx="0" ry="0" width="50" height="9" />
  </ContentLoader>
);

export const NewsListPlaceholder = () => {
  const { darkMode } = useContext(AppContext);
  return (
    <div className="news_loader_container">
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
      <span>
        <NewsLoader darkMode={darkMode} />
      </span>
    </div>
  );
};
