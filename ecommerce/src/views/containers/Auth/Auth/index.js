import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../../../stores/slices/userSlice";

export function Auth({ children }) {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("user");
  useEffect(() => {
    if (userId) {
      dispatch(fetchUser({ id: userId }));
    }
  }, [dispatch, userId]);

  return children;
}
