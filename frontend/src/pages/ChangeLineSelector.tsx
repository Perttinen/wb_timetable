import { useNavigate } from "react-router";
import LineSelector from "../components/LineSelector";

const ChangeLineSelector = () => {
  const navigate = useNavigate();

  const handleSelectLine = (lineId: number) => {
    void navigate(`/logged/lines/change/${lineId}`);
  };

  return <LineSelector onSelectLine={handleSelectLine} caption="SELECT LINE" />;
};

export default ChangeLineSelector;
