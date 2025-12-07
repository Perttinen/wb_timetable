import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { userTypes } from "../../../types";

export const UserDataTable = ({ user }: { user: userTypes.TUserSafe }) => {
  const userLevel = user.userlevels.includes("admin") ? "admin" : "user";

  return (
    <Box sx={{ margin: 1 }}>
      <Table size="small" aria-label="purchases">
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography>username</Typography>
            </TableCell>
            <TableCell>{user.username}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>user level</Typography>
            </TableCell>
            <TableCell>{userLevel}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
