import { useAppSelector } from "../redux/hooks";

const Users = () => {
  const users = useAppSelector((state) => state.users);
  return (
    <div>
      <h2>Lines</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            username: {user.username}, disabled: {String(user.disabled)},
            userlevels:{" "}
            {user.userlevels.map((userlevel) => userlevel).join(" | ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
