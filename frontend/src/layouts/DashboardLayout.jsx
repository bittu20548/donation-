import {
  Link,
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Trophy,
  Heart,
  CreditCard,
  LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


function DashboardLayout() {
  const navigate =
    useNavigate();

  const {
    user,
    logout
  } = useAuth();


  function handleLogout() {
    logout();

    navigate("/login");
  }


  return (
    <div>

      {/* ============================= */}
      {/* SIDEBAR */}
      {/* ============================= */}

      <aside>

        <h2>
          Digital Heroes
        </h2>


        <nav>

          <Link to="/dashboard">
            <LayoutDashboard
              size={18}
            />

            Dashboard
          </Link>


          <Link to="/dashboard/scores">
            <Trophy
              size={18}
            />

            My Scores
          </Link>


          <Link to="/dashboard/charity">
            <Heart
              size={18}
            />

            My Charity
          </Link>


          <Link to="/dashboard/subscription">
            <CreditCard
              size={18}
            />

            Subscription
          </Link>

        </nav>


        {/* =========================== */}
        {/* USER */}
        {/* =========================== */}

        <div>

          <p>
            {user?.name}
          </p>

          <p>
            {user?.email}
          </p>


          <button
            onClick={
              handleLogout
            }
          >
            <LogOut
              size={18}
            />

            Logout
          </button>

        </div>

      </aside>


      {/* ============================= */}
      {/* MAIN CONTENT */}
      {/* ============================= */}

      <main>

        <Outlet />

      </main>

    </div>
  );
}


export default DashboardLayout;