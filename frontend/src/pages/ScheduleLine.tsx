import { useParams } from "react-router-dom";

const ScheduleLine = () => {
  const { lineId } = useParams<{ lineId: string }>();

  if (!lineId) return <div>No line selected</div>;
  return <div>{lineId}</div>;
};

export default ScheduleLine;
