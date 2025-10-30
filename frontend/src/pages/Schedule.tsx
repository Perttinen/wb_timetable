import { useNavigate } from "react-router";
import LineSelector from "../components/LineSelector";
import { useAppDispatch } from "../redux/hooks";
import { useEffect } from "react";
import { setLines } from "../redux/lines/linesSlice";
import { useGetLinesQuery } from "../redux/lines/linesApi";

const Schedule = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: lines } = useGetLinesQuery();

  useEffect(() => {
    if (lines) dispatch(setLines(lines));
  }, [lines]);

  const handleSelectLine = (lineId: number) => {
    void navigate(`/logged/schedule/${lineId}`);
  };

  return <LineSelector onSelectLine={handleSelectLine} caption="SELECT LINE" />;
};

export default Schedule;
