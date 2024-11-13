import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// 슬라이드 업 애니메이션 정의
const slideUp = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`;

const Section = styled.section`
  margin: 0 20px;
  margin-bottom: 45px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
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

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  margin-top: 60px;
`;

const RunningPostList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px; // 기본 최대 높이
  overflow-y: auto; // 초과 시 스크롤 활성화
  padding-right: 10px; // 스크롤 여백 확보

  // 반응형 설정
  @media (max-width: 768px) {
    max-height: 200px; // 태블릿 크기에서 높이 조정
  }

  @media (max-width: 480px) {
    max-height: 150px; // 모바일 크기에서 높이 조정
  }
`;

const RunningPost = styled.div`
  display: flex;
  gap: 10px;
  height: 77px;

  & .first-column {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: #ddd; // 임시 배경 (이미지 없는 경우 대비)
    overflow: hidden;
    & img {
      width: 100%;
    }
  }

  & .second-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
  }

  & .username {
    font-size: 16px;
    font-weight: bold;
  }

  & .text {
    font-size: 14px;
    color: #555;
  }

  & .end-date {
    font-size: 12px;
    color: #aaa;
  }
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
    username: "민석",
    text: "올림픽 공원에서 러닝 하실분~",
    profileUrl: null, // 이미지가 없을 때 기본 회색 배경
    endDate: "2024.11.15",
  },
  {
    username: "지수",
    text: "한강공원에서 러닝 크루 모집합니다!",
    profileUrl:
      "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
    endDate: "2024.11.18",
  },
  {
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
  {
    username: "유진",
    text: "송도 센트럴파크 러닝 같이해요~",
    profileUrl: null,
    endDate: "2024.11.20",
  },
];

function Home() {
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

  return (
    <>
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
              <RunningPost key={index}>
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
