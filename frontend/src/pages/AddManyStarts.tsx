import { useParams } from "react-router-dom";

const AddManyStarts = () => {
  const { lineId } = useParams<{ lineId: string }>();
  return <>add many to {lineId}</>;
};

export default AddManyStarts;
