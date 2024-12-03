import { useSelector } from "react-redux";
import { Message, RunningPost, RunningPostList, Section, Title } from "../../components/Section/Active";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const RUNNING_ACTIVE = [
  {
    id: 2,
    username: "민석",
    text: "한강공원에서 러닝 크루 모집합니다!",
    profileUrl:
      "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
    endDate: "2024.11.18",
  },
  {
    id: 2,
    username: "지수",
    text: "올림픽 공원에서 러닝 크루 모집합니다!",
    profileUrl:
      "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
    endDate: "2024.11.18",
  },
  {
    id: 3,
    username: "김수훈",
    text: "한강공원에서 러닝 크루 같이 할 사람 손들어~",
    profileUrl:
      "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
    endDate: "2024.11.18",
  },
];

const ProfileInfoSection = styled(Section)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const ProfileImgContainer = styled.div`
  width: 108px;
  height: 108px;
  border-radius: 100%;
  background-color: #979797;
  overflow: hidden;
  & img {
    width: 100%;
  }
`;

const NameSpan = styled.span`
  font-size: 19px;
  font-weight: bold;
`;

const ProfileUpdateBtn = styled.button`
  background-color: #fff;
  font-weight: bold;
  font-size: 19px;
  padding: 10px 20px;
  border-radius: 20px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

function Profile() {
  const user = useSelector((state: RootState) => state.userSlice);
  const navigate = useNavigate();

  const handleRunningPostClick = (postId: number) => {
    if (!user.userId) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    } else {
      navigate(`/post/${postId}`);
    }
  };

  const redirect = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <ProfileInfoSection>
        <ProfileImgContainer>{user.photoUrl && <img src={user.photoUrl} alt="프로필 이미지" />}</ProfileImgContainer>
        <NameSpan>{user.userName}</NameSpan>
        <ProfileUpdateBtn onClick={() => redirect("/profile/update")}>프로필 수정</ProfileUpdateBtn>
      </ProfileInfoSection>
      <Section>
        <Title>러닝 활동</Title>
        {RUNNING_ACTIVE.length === 0 ? (
          <Message>활동한 러닝 없습니다.</Message>
        ) : (
          <RunningPostList>
            {RUNNING_ACTIVE.map((post, index) => (
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

export default Profile;
