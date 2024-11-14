/* eslint-disable @typescript-eslint/no-explicit-any */
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";

import { useEffect } from "react";
import { initializeKakao } from "../kakao";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import logo from "../../public/logo.png";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  color: #333;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin: 45px 0px;

  @media (max-width: 768px) {
    margin: 30px 0;
  }
`;

const LogoImg = styled.img`
  width: 275px;
  height: 335px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 220px;
    height: 270px;
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 20px;
`;

const LoginBtn = styled.button`
  width: 250px;
  height: 50px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 16px;
  padding: 0 20px;
  transition: background-color 0.3s, box-shadow 0.3s;

  &.kakao {
    background-color: #fee500;
    color: #000000;
    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: #f9e000;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
  }

  &.google {
    background-color: #ffffff;
    color: #4285f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: #f1f1f1;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: 768px) {
    width: 200px;
    font-size: 14px;
  }
`;

function Login() {
  useEffect(() => {
    initializeKakao();
  }, []);

  const handleKakaoLogin = (): void => {
    if (!window.Kakao) {
      console.error("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      success: (authObj: any) => {
        console.log("카카오 로그인 성공:", authObj);

        // 사용자 정보 요청
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: (response: any) => {
            const { id, kakao_account } = response;
            const nickname = kakao_account.profile.nickname;
            const profileImageUrl = kakao_account.profile.profile_image_url;

            console.log(id, nickname, profileImageUrl);
          },
          fail: (error: any) => {
            console.error("사용자 정보 요청 실패:", error);
          },
        });
      },
      fail: (error: any) => {
        console.error("카카오 로그인 실패:", error);
      },
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log(user);
    } catch (error) {
      console.error("구글 로그인 에러:", error);
    }
  };

  /*
  const handleKakaoLogout = () => {
    if (!window.Kakao.Auth.getAccessToken()) {
      console.log("로그인 상태가 아닙니다.");
      return;
    }
    window.Kakao.Auth.logout(() => {
      console.log("카카오 로그아웃 성공");
      // 로그아웃 후 상태 초기화
      //   setUserInfo(null);
    });
  };
    */
  /*
  const handleGoogleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("로그아웃 성공");
      })
      .catch((error) => {
        console.log("로그아웃 실패 ", error);
      });
  };
  */

  return (
    <>
      <Header>
        <Title>러닝 크루</Title>
      </Header>
      <Main>
        <LogoImg src={logo} />
      </Main>
      <Footer>
        <LoginBtn onClick={handleKakaoLogin} className="kakao">
          <RiKakaoTalkFill />
          카카오 로그인
        </LoginBtn>
        <LoginBtn onClick={handleGoogleLogin} className="google">
          <FaGoogle />
          구글 로그인
        </LoginBtn>
      </Footer>
    </>
  );
}

export default Login;
