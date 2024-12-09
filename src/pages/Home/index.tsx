import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Firebase 인증 관련 함수
import styled, { keyframes } from "styled-components";
import { userActions } from "../../store/slices/user-slice";
import { auth } from "../../firebase";
import { RootState } from "../../store";
import { Message, RunningPost, RunningPostList, Section, Title } from "../../components/Section/Active";

// 슬라이드 업 애니메이션 정의
const slideUp = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`;

const Hader = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const LogInOutBtn = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  &:hover {
    border-bottom: 1px solid black;
  }
  margin-right: 10px;
`;

const RankContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: 20px;
`;

const RankList = styled.div`
  animation: ${slideUp} 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RankSpan = styled.span`
  font-size: 18px;
`;

const TOP_10_RUNNING_PLACE = [
  { text: "김포 한강공원", rank: 1 },
  { text: "올림픽 공원", rank: 2 },
  { text: "강릉 경포대", rank: 3 },
  { text: "대전 엑스포 공원", rank: 4 },
  { text: "속초 설악산", rank: 5 },
  { text: "전주 한옥마을", rank: 6 },
  { text: "춘천 레이크사이드", rank: 7 },
  { text: "광주 무등산", rank: 8 },
  { text: "송도 센트럴파크", rank: 9 },
  { text: "제주 한라산", rank: 10 },
];

const RUNNING_CREW_POSTS = [
  {
    id: 1,
    username: "민석",
    text: "올림픽 공원에서 러닝 하실분~",
    profileUrl: null,
    endDate: "2024.11.15",
  },
  {
    id: 2,
    username: "지수",
    text: "한강공원에서 러닝 크루 모집합니다!",
    profileUrl:
      "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
    endDate: "2024.11.18",
  },
  {
    id: 3,
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    id: 4,
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    id: 5,
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    id: 6,
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    id: 7,
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    id: 8,
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    id: 9,
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
];

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userSlice); // 리덕스에서 로그인 상태 가져오기
  const [currentList, setCurrentList] = useState(TOP_10_RUNNING_PLACE.slice(0, 5)); // 초반 1~5위 표시
  const [isFirstGroup, setIsFirstGroup] = useState(true); // 현재 표시 중인 그룹 트래킹

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFirstGroup((prev) => !prev); // 그룹 전환
      setCurrentList(
        isFirstGroup
          ? TOP_10_RUNNING_PLACE.slice(5, 10) // 6~10위
          : TOP_10_RUNNING_PLACE.slice(0, 5) // 1~5위
      );
    }, 5000); // 5초마다 전환

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, [isFirstGroup]);

  useEffect(() => {
    if (!user) {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // 로그인된 경우, Firebase의 사용자 정보를 리덕스 상태에 저장
          dispatch(
            userActions.setUser({
              userId: firebaseUser.uid,
              userName: firebaseUser.displayName || "",
              photoUrl: firebaseUser.photoURL || "",
              provider: "google",
            })
          );
        } else {
          // 로그아웃된 경우, 리덕스 상태 초기화
          dispatch(userActions.clearUser());
        }
      });
    }
  }, [dispatch]);

  const handleLogout = () => {
    if (user.provider === "google") {
      const auth = getAuth(); // Firebase 인증 객체 가져오기
      signOut(auth); // Firebase 로그아웃
      dispatch(userActions.clearUser()); // 리덕스 상태 초기화
    } else {
      if (!window.Kakao.Auth.getAccessToken()) {
        console.log("로그인 상태가 아닙니다.");
        return;
      }
      window.Kakao.Auth.logout(() => {
        dispatch(userActions.clearUser());
      });
    }

    alert("로그아웃되었습니다.");
  };

  const handleRunningPostClick = (postId: number) => {
    if (!user.userId) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    } else {
      navigate(`/post/${postId}`);
    }
  };

  const handleNavigate = () => {
    navigate("/login");
  };
  return (
    <>
      <Hader>
        {user.userId ? (
          <LogInOutBtn onClick={handleLogout}>로그아웃</LogInOutBtn>
        ) : (
          <LogInOutBtn onClick={handleNavigate}>로그인</LogInOutBtn>
        )}
      </Hader>
      <Section>
        <Title>Top 10 러닝 장소</Title>
        <RankContainer>
          <RankList key={isFirstGroup ? "group1" : "group2"}>
            {currentList.map((place) => (
              <RankSpan key={place.text}>
                {place.rank}. {place.text}
              </RankSpan>
            ))}
          </RankList>
        </RankContainer>
      </Section>

      <Section>
        <Title>같이 러닝 해요</Title>
        {RUNNING_CREW_POSTS.length === 0 ? (
          <Message>생성한 러닝 크루 없습니다.</Message>
        ) : (
          <RunningPostList>
            {RUNNING_CREW_POSTS.map((post, index) => (
              <RunningPost key={index} onClick={() => handleRunningPostClick(post.id)}>
                <div
                  className="first-column"
                  style={{
                    backgroundImage: post.profileUrl ? `url(${post.profileUrl})` : "none",
                  }}
                >
                  {post.profileUrl && <img src={post.profileUrl} />}
                </div>
                <div className="second-column">
                  <span className="username">{post.username}</span>
                  <span className="text">{post.text}</span>
                  <span className="end-date">{post.endDate} 까지</span>
                </div>
              </RunningPost>
            ))}
          </RunningPostList>
        )}
      </Section>
    </>
  );
}

export default Home;
