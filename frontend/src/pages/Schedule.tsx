import { useNavigate } from "react-router";
import LineSelector from "../components/LineSelector";

const Schedule = () => {
  const navigate = useNavigate();
  const handleSelectLine = (lineId: number) => {
    void navigate(`/logged/schedule/${lineId}`);
  };

  return <LineSelector onSelectLine={handleSelectLine} caption="SELECT LINE" />;
};

export default Schedule;
