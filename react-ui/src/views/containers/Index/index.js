import { Outlet } from "react-router-dom";
import MainWrapper from "../../components/MainWrapper";

export const Index = () => (
  <MainWrapper>
    <Outlet />
  </MainWrapper>
);
