import TableContainer from "@mui/material/TableContainer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteDockMutation } from "../redux/docks/docksApi";
import { deleteDock } from "../redux/docks/docksSlice";

const Docks = () => {
  const docks = useAppSelector((state) => state.docks);
  const [deleteDockMutation] = useDeleteDockMutation();
  const dispatch = useAppDispatch();

  const handleDeleteDock = async (dockId: number) => {
    try {
      await deleteDockMutation(dockId).unwrap();
      dispatch(deleteDock(dockId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
        <TableBody>
          {docks.map((dock) => (
            <TableRow key={dock.id}>
              <TableCell component="th" scope="row">
                {dock.name}
              </TableCell>
              <TableCell align="right">
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <IconButton onClick={() => handleDeleteDock(Number(dock.id))}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Docks;
