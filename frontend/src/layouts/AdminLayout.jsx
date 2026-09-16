import {
  Link,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  Heart,
  Trophy,
  Gift,
  IndianRupee,
  LogOut
} from "lucide-react";

import {
  useAuth
} from "../context/AuthContext";


function AdminLayout() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    logout
  } = useAuth();


  function handleLogout() {

    logout();

    navigate(
      "/login",
      {
        replace: true
      }
    );

  }


  function active(path) {
    return location.pathname === path
      ? "active"
      : "";
  }


  return (
    <div className="admin-layout">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <aside className="admin-sidebar">

        {/* LOGO */}

        <Link
          to="/admin"
          className="admin-logo"
        >

          <Heart size={22} />

          <span>
            Digital Heroes
          </span>

        </Link>


        <div className="admin-label">
          ADMIN PANEL
        </div>


        {/* NAVIGATION */}

        <nav className="admin-nav">

          <Link
            to="/admin"
            className={active("/admin")}
          >
            <LayoutDashboard
              size={18}
            />

            Dashboard
          </Link>


          <Link
            to="/admin/users"
            className={active(
              "/admin/users"
            )}
          >
            <Users size={18} />

            Users
          </Link>


          <Link
            to="/admin/subscriptions"
            className={active(
              "/admin/subscriptions"
            )}
          >
            <CreditCard size={18} />

            Subscriptions
          </Link>


          <Link
            to="/admin/charities"
            className={active(
              "/admin/charities"
            )}
          >
            <Heart size={18} />

            Charities
          </Link>


          <Link
            to="/admin/draws"
            className={active(
              "/admin/draws"
            )}
          >
            <Trophy size={18} />

            Draws
          </Link>


          <Link
            to="/admin/winners"
            className={active(
              "/admin/winners"
            )}
          >
            <Gift size={18} />

            Winners
          </Link>


          <Link
            to="/admin/donations"
            className={active(
              "/admin/donations"
            )}
          >
            <IndianRupee size={18} />

            Donations
          </Link>

        </nav>


        {/* USER */}

        <div className="admin-user">

          <div className="admin-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "A"}
          </div>

          <div className="admin-user-details">

            <strong>
              {user?.name}
            </strong>

            <span>
              Administrator
            </span>

          </div>


          <button
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={17} />
          </button>

        </div>

      </aside>


      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <main className="admin-main">

        <Outlet />

      </main>

    </div>
  );
}


export default AdminLayout;