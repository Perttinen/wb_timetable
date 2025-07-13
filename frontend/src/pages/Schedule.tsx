import { useAppSelector } from "../redux/hooks";

const Schedule = () => {
  const lines = useAppSelector((state) => state.lines);
  return (
    <div>
      <h2>Schedule</h2>
      <ul>
        {lines.map((line) => (
          <li key={line.id}>
            start: {line.startDock.name}, end: {line.endDock.name}, stops:{" "}
            {line.stopDocks.map((stopDock) => stopDock.name).join(" | ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
