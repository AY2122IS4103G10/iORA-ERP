import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../../../stores/slices/userSlice";

export function Auth({ children }) {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("user");
  const userState = useSelector(state => state.user.status)
  useEffect(() => {
    if (userId) {
      userState === "idle" && dispatch(fetchUser({ id: userId }));
    }
  }, [dispatch, userId, userState]);

  return children;
}
