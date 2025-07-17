import Button from "@mui/material/Button";

type ScheduleLineProps = {
  setScheduleLineId: React.Dispatch<React.SetStateAction<number | null>>;
  lineId: number;
};

const ScheduleLine = ({ setScheduleLineId, lineId }: ScheduleLineProps) => {
  return (
    <div>
      <Button onClick={() => setScheduleLineId(null)}>back</Button>
      {lineId}
    </div>
  );
};

export default ScheduleLine;
