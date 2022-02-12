import { Outlet } from "react-router-dom";
import MainWrapper from "../../components/MainWrapper";

export const Index = () => (
  <div className="h-screen bg-gray-100">
    <MainWrapper>
      <Outlet />
    </MainWrapper>
  </div>
);
