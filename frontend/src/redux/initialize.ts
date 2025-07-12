import { useEffect } from "react";
import { useGetDocksQuery } from "./docks/docksApi";
import { setDocks } from "./docks/docksSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useGetLinesQuery } from "./lines/linesApi";
import { setLines } from "./lines/linesSlice";
import { setUsers } from "./users/usersSlice";
import { useGetUsersQuery } from "./users/usersApi";

const useInitialize = (): void => {
  const dispatch = useAppDispatch();
  const docks = useGetDocksQuery();
  const lines = useGetLinesQuery();
  const users = useGetUsersQuery();
  console.log(users);

  const loggedUser = useAppSelector((state) => state.loggedUser);
  useEffect(() => {
    if (docks.data && lines.data && loggedUser.user) {
      dispatch(setDocks(docks.data));
      dispatch(setLines(lines.data));
      if (users.data) {
        dispatch(setUsers(users.data));
      }
    }
  }, [docks, lines, loggedUser, users, dispatch]);
};

export default useInitialize;
