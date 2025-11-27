import { useNavigate } from "react-router";

import Spinner from "../../components/Spinner";
import UniversalSelector from "../../components/UniversalSelector";
import { useGetLinesQuery } from "../../redux/api/lineApi";

const Schedule = () => {
  const { data: lines, isLoading: IsLoadingLines } = useGetLinesQuery();
  const navigate = useNavigate();
  const handleSelectLine = (lineId: number) => {
    void navigate(`/logged/schedule/${lineId}`);
  };

  return (
    <>
      {IsLoadingLines && <Spinner />}
      {!IsLoadingLines && lines && (
        <UniversalSelector
          onSelect={handleSelectLine}
          caption="SCHEDULE"
          input={{ data: lines, type: "lines" }}
        />
      )}
    </>
  );
};

export default Schedule;
