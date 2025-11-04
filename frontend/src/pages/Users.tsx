import Spinner from "../components/Spinner";
import { useGetUsersQuery } from "../redux/api";

const Users = () => {
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();

  const isBusy = isLoadingUsers;

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingUsers && users && (
        <div>
          <h2>Users</h2>
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
      )}
    </>
  );
};

export default Users;
