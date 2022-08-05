import { useParams } from "react-router-dom";

export const Article = () => {
  let { topicId } = useParams();

  return (
    <div>
      <h3>{topicId}</h3>
    </div>
  );
};
