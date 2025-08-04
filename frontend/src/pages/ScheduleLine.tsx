import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

// type ScheduleLineProps = {
//   setSelectedLineId: React.Dispatch<React.SetStateAction<number | null>>;
//   lineId: number;
// };

const ScheduleLine = () =>
  // { setSelectedLineId, lineId }: ScheduleLineProps
  {
    const { lineId } = useParams<{ lineId: string }>();

    if (!lineId) return <div>No line selected</div>;
    return (
      <div>
        {/* <Button onClick={() => setSelectedLineId(null)}>back</Button> */}
        {lineId}
      </div>
    );
  };

export default ScheduleLine;
