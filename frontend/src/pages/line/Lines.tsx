import { useNavigate } from "react-router-dom";
import { useGetLinesQuery } from "../../redux/api";
import UniversalSelector from "../../components/UniversalSelector";
import Spinner from "../../components/Spinner";

const Lines = () => {
  const navigate = useNavigate();
  const { data: lines, isLoading: IsLoadingLines } = useGetLinesQuery();

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
    <>
      {IsLoadingLines && <Spinner />}
      {!IsLoadingLines && lines && (
        <UniversalSelector
          input={{ type: "lines", data: lines }}
          onAdd={onAdd}
          onSelect={handleSelectLine}
          caption="LINES"
        />
      )}
    </>
  );
};

export default Lines;
