import { useParams } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const ChangeLine = () => {
  const { lineId } = useParams<{ lineId: string }>();

  const lineToChange = useAppSelector((state) => state.lines).find(
    (line) => line.id === Number(lineId)
  );

  return <>{lineToChange?.startDock.name}</>;
};

export default ChangeLine;
