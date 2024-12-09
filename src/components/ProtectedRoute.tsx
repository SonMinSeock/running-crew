import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.userSlice);

  if (!user.userId) {
    return <Navigate to={"/login"} />;
  }
  return children;
}

export default ProtectedRoute;
