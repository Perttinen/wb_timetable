import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useGetLinesQuery } from "./lines/linesApi";
import { setLines } from "./lines/linesSlice";
import { setUsers } from "./users/usersSlice";
import { useGetUsersQuery } from "./users/usersApi";

const useInitialize = (): void => {
  const dispatch = useAppDispatch();
  const lines = useGetLinesQuery();

  const loggedUser = useAppSelector((state) => state.loggedUser);
  const shouldFetchUsers = loggedUser.user?.userlevels.includes("admin");
  const users = useGetUsersQuery(undefined, { skip: !shouldFetchUsers });

  useEffect(() => {
    if (lines.data) dispatch(setLines(lines.data));
    if (users.data) dispatch(setUsers(users.data));
  }, [lines, loggedUser, users, dispatch]);
};

export default useInitialize;
