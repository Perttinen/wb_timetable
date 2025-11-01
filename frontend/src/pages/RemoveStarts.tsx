import { useParams } from "react-router-dom";

const RemoveStarts = () => {
  const { lineId } = useParams<{ lineId: string }>();
  return <>remove from {lineId}</>;
};

export default RemoveStarts;
