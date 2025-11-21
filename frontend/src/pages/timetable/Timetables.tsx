import { useNavigate } from "react-router-dom";
import UniversalSelector from "../../components/UniversalSelector";
import { useGetDocksQuery } from "../../redux/api";
import Spinner from "../../components/Spinner";

const Timetables = () => {
  const { data: docks, isLoading: isLoadingDocks } = useGetDocksQuery();
  const navigate = useNavigate();

  const isLoggedRoute = location.pathname.includes("logged");

  const handleSelectTimetable = (dockId: number | null) => {
    const dockTimetablePath = isLoggedRoute
      ? `/logged/timetables/${dockId}`
      : `/timetables/${dockId}`;
    void navigate(dockTimetablePath);
  };

  return (
    <>
      {isLoadingDocks && <Spinner />}
      {!isLoadingDocks && docks && (
        <UniversalSelector
          onSelect={handleSelectTimetable}
          caption="TIMETABLES"
          input={{ type: "docks", data: docks }}
        />
      )}
    </>
  );
};

export default Timetables;
