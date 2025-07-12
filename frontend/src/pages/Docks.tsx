import { useAppSelector } from "../redux/hooks";

const Docks = () => {
  const docks = useAppSelector((state) => state.docks);
  return (
    <div>
      <h2>Docks</h2>
      <ul>
        {docks.map((dock) => (
          <li key={dock.id}>{dock.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Docks;
