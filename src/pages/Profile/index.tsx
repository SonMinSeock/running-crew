import { useDispatch, useSelector } from "react-redux";
import { Message, RunningPost, RunningPostList, Section, Title } from "../../components/Section/Active";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { postActions, PostState } from "../../store/slices/post-slice";

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
  const [posts, setPosts] = useState<PostState[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchPosts = async () => {
      const postQuery = query(
        collection(db, "posts"),
        where("userId", "==", user.userId),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      unsubscribe = await onSnapshot(postQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => {
          const { userId, title, photoUrl, description, imgUrl, username, runningDate } = doc.data();
          return { userId, title, photoUrl, description, imgUrl, id: doc.id, username, runningDate };
        });
        setPosts(postsData);
      });
    };

    fetchPosts();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      unsubscribe && unsubscribe();
    };
  }, []);

  const handleRunningPostClick = (postId: string | null, postData: PostState) => {
    if (!user.userId) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    } else {
      dispatch(postActions.setPost(postData));
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
        {posts.length === 0 ? (
          <Message>활동한 러닝 없습니다.</Message>
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
                  <span className="end-date">{post.runningDate} 러닝</span>
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
