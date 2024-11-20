import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  padding-top: 80px;
  max-width: 480px; /* 모바일 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  background-color: #fff; /* 필요에 따라 배경색 추가 */
`;

function LoginLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export default LoginLayout;
