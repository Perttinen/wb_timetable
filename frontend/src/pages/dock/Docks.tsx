import { useNavigate } from "react-router-dom";

import Spinner from "../../components/Spinner";
import UniversalSelector from "../../components/UniversalSelector";
import { useGetDocksQuery } from "../../redux/api/dockApi";

const Docks = () => {
  const navigate = useNavigate();

  const { data: docks, isLoading: isLoadingDocks } = useGetDocksQuery();

  const handleSelectDock = (dockId: number) => {
    void navigate(`/logged/docks/change/${dockId}`);
  };

  const onAdd = {
    function: () => navigate(`/logged/docks/create`),
    text: "create new dock",
  };

  return (
    <>
      {isLoadingDocks && <Spinner />}
      {!isLoadingDocks && docks && (
        <UniversalSelector
          input={{ type: "docks", data: docks }}
          onAdd={onAdd}
          onSelect={handleSelectDock}
          caption="DOCKS"
        />
      )}
    </>
  );
};

export default Docks;
