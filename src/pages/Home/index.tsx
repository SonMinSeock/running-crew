import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut, Unsubscribe } from "firebase/auth"; // Firebase 인증 관련 함수
import styled, { keyframes } from "styled-components";
import { userActions } from "../../store/slices/user-slice";
import { auth, db } from "../../firebase";
import { RootState } from "../../store";
import { Message, RunningPost, RunningPostList, Section, Title } from "../../components/Section/Active";
import { postActions, PostState } from "../../store/slices/post-slice";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";

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
    box-shadow: inset 0 -1px 0 black; /* hover 시 box-shadow로 밑줄 효과 추가, 호버 상일때 밑으로 미는 현상을 해결 방법 */
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

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.userSlice); // 리덕스에서 로그인 상태 가져오기
  const { posts } = useSelector((state: RootState) => state.postSlice);
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

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchPosts = async () => {
      const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(25));
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => {
          const { userId, title, photoUrl, description, imgUrl, username, runningDate } = doc.data();
          return { userId, title, photoUrl, description, imgUrl, id: doc.id, username, runningDate };
        });
        dispatch(postActions.setPosts(postsData));
      });
    };

    fetchPosts();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      unsubscribe && unsubscribe();
    };
  }, []);

  useEffect(() => {
    dispatch(postActions.resetPost());
  }, [location]);

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

  const handleRunningPostClick = (postId: string | null, postData: PostState) => {
    dispatch(postActions.setPost(postData));
    navigate(`/post/${postId}`);
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
        {posts.length === 0 ? (
          <Message>생성한 러닝 크루 없습니다.</Message>
        ) : (
          <RunningPostList>
            {posts.map((post) => (
              <RunningPost key={post.id} onClick={() => handleRunningPostClick(post?.id ?? null, post)}>
                <div
                  className="first-column"
                  style={{
                    backgroundImage: post.photoUrl ? `url(${post.photoUrl})` : "none",
                  }}
                >
                  {post.photoUrl && <img src={post.photoUrl} />}
                </div>
                <div className="second-column">
                  <span className="username">{post.username}</span>
                  <span className="text">{post.title}</span>
                  <span className="end-date">{post.runningDate} 날 러닝</span>
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
