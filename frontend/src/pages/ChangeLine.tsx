import { useParams } from "react-router-dom";
import { useGetLineQuery } from "../redux/api";

const ChangeLine = () => {
  const { lineId } = useParams<{ lineId: string }>();

  const { data: line, isLoading } = useGetLineQuery(Number(lineId));

  return (
    <>
      {" "}
      {!isLoading && line ? (
        <div>{line.startDock.name}</div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default ChangeLine;
