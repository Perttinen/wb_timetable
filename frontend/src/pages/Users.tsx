import { useGetUsersQuery } from "../redux/users/usersApi";

const Users = () => {
  const { data: users, isLoading } = useGetUsersQuery();
  return (
    <>
      {!isLoading && users ? (
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
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Users;
