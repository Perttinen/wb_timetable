import { Box, Button, CardContent, CardActions, Card } from "@mui/material"
import { useState } from "react"

import { UserDataTable } from "./UserDataTable"
import { ChangePassword } from "./ChangePassword"
import Spinner from "./Spinner"
import { useGetMeQuery } from "../redux/api/authApi"

export const UserCard = ({
  userCard,
  setUserCard,
}: {
  userCard: boolean
  setUserCard: (val: boolean) => void
}) => {
  const { data: user, isLoading: isLoadingUser } = useGetMeQuery()

  const [pwChangeDialog, setPwChangeDialog] = useState(false)

  const isBusy = isLoadingUser

  return (
    <div>
      {isBusy && <Spinner />}
      {userCard && user && (
        <Card sx={{ minWidth: 275, marginBottom: "20px" }}>
          <CardContent>
            <UserDataTable user={user} />
          </CardContent>
          <Box display={"flex"} flexDirection={"row"}>
            <CardActions>
              <Button onClick={() => setUserCard(false)} size="small">
                close
              </Button>
            </CardActions>
            <CardActions>
              <Button onClick={() => setPwChangeDialog(true)} size="small">
                change password
              </Button>
            </CardActions>
          </Box>
          {pwChangeDialog && (
            <ChangePassword
              user={user}
              pwChangeDialog={pwChangeDialog}
              setPwChangeDialog={setPwChangeDialog}
            />
          )}
        </Card>
      )}
    </div>
  )
}
