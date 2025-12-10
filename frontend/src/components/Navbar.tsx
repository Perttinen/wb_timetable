import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  MenuItem,
  Tooltip,
  Button,
  Avatar,
  Container,
  Menu,
  Typography,
  IconButton,
  Toolbar,
  Box,
  AppBar,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { useTheme } from "@mui/material/styles";

import { UserCard } from "./UserCard";
import { useGetMeQuery, useLogoutMutation } from "../redux/api/authApi";

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [usercard, setUsercard] = useState(false);
  const { data: loggedUser } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  const getPagesByUserlevels = (userlevels: string[]) => {
    const pagesToShow = [];
    if (userlevels.includes("user"))
      pagesToShow.push("timetables", "schedule", "docks", "lines");
    if (userlevels.includes("admin")) pagesToShow.push("users");
    return pagesToShow;
  };

  const avatar = !loggedUser ? "?" : loggedUser.username[0].toUpperCase();

  const showProfile = () => {
    setUsercard(true);
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    void navigate("/");
    setTimeout(() => logout(), 500);
  };

  const pages = loggedUser ? getPagesByUserlevels(loggedUser.userlevels) : [];

  const userMenuItems = [
    { label: "Profile", function: () => showProfile() },
    { label: "Logout", function: () => handleLogout() },
  ];

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              WB-LINE
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      <Link
                        style={{
                          textDecoration: "none",
                          color: theme.palette.primary.main,
                        }}
                        to={`/logged/${page}`}
                      >
                        {page}
                      </Link>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => {
                const isActive = location.pathname.includes(page);
                return (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      bgcolor: isActive
                        ? theme.palette.primary.dark
                        : theme.palette.primary.main,
                      fontWeight: isActive ? "bold" : "normal",
                      borderBottom: isActive ? "blue" : "none",
                      display: "block",
                      color: "white",
                    }}
                  >
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      to={`/logged/${page}`}
                    >
                      {page}
                    </Link>
                  </Button>
                );
              })}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{avatar}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userMenuItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => item.function()}>
                    <Typography sx={{ textAlign: "center" }}>
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <UserCard setUserCard={setUsercard} userCard={usercard} />
    </>
  );
};

export default Navbar;
