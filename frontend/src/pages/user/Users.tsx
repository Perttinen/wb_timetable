import Spinner from "../../components/Spinner";
import { useGetUsersQuery } from "../../redux/api";
import { useNavigate } from "react-router-dom";
import UniversalSelector from "../../components/UniversalSelector";

const Users = () => {
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const navigate = useNavigate();

  const handleNewUser = () => {
    void navigate("/logged/users/create");
  };

  const handleUserSelection = (userId: number) => {
    void navigate(`/logged/users/change/${userId}`);
  };

  const onAdd = {
    function: handleNewUser,
    text: "create new user",
  };

  const isBusy = isLoadingUsers;

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingUsers && users && (
        <UniversalSelector
          onSelect={handleUserSelection}
          caption="USERS"
          input={{ type: "users", data: users }}
          onAdd={onAdd}
        />
      )}
    </>
  );
};

export default Users;
