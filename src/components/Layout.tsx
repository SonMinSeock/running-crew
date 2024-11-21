import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoHomeSharp, IoAdd } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const Container = styled.div`
  height: 100%;
  padding-top: 80px;
  max-width: 480px; /* 모바일 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  background-color: #fff; /* 필요에 따라 배경색 추가 */
  padding-bottom: 100px; /* NavBar와의 간격을 넉넉히 확보 */
`;

const NavBar = styled.footer`
  position: fixed;
  bottom: 0px;
  width: 100%;
  max-width: 480px; /* 모바일 최대 너비 */
  height: 58px;
  background-color: #fafafa;
  border-top: 1px solid #979797;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 auto; /* 가운데 정렬 */
  left: 50%;
  transform: translateX(-50%); /* NavBar가 화면 중앙에 위치하도록 설정 */

  & svg {
    font-size: 25px;
    cursor: pointer;
  }
`;

function Layout() {
  const navigate = useNavigate();
  const handleRedirect = (path: string) => {
    navigate(path);
  };
  return (
    <>
      <Container>
        <Outlet />
        <NavBar>
          <IoAdd onClick={() => handleRedirect("/post/create")} />
          <IoHomeSharp onClick={() => handleRedirect("/")} />
          <CgProfile />
        </NavBar>
      </Container>
    </>
  );
}

export default Layout;
