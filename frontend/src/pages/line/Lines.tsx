import { useNavigate } from "react-router-dom";
import LineSelector from "../../components/LineSelector";

const Lines = () => {
  const navigate = useNavigate();

  const handleSelectLine = (lineId: number) => {
    void navigate(`/logged/lines/change/${lineId}`);
  };
  const handleNewLine = () => {
    void navigate(`/logged/lines/create`);
  };

  const onAdd = {
    function: handleNewLine,
    text: "create new line",
  };

  return (
    <LineSelector
      onAdd={onAdd}
      onSelectLine={handleSelectLine}
      caption="LINES"
    />
  );
};

export default Lines;
