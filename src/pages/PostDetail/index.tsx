import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "../../store";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { postActions } from "../../store/slices/post-slice";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BeatLoader } from "react-spinners";
import { LoadingContainer } from "../../components/Loading";

const Post = styled.div`
  margin: auto;
  max-width: 343px;
  min-height: 318px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PostImageBox = styled.div`
  width: 100%;
  height: 240px;
  background-color: #f6f6f6;
  border: none;
  border-radius: 8px;
  overflow: hidden;
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
`;

const PostTitle = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const PostText = styled.span`
  font-size: 14px;
`;

const PostDate = styled.span`
  font-size: 14px;
  color: #bdbdbd;
`;

const ButtonContainer = styled.section`
  display: flex;
  gap: 10px;
`;

const Btn = styled.button`
  background-color: #cffd4f;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  width: 80px;
  padding: 8px 0;
  cursor: pointer;
  &.running-btn {
    background-color: #ff9505;
    color: #fff;
  }
  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const ParticipantCount = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-top: 15px;
  margin-bottom: 5px;
  display: block; /* 줄바꿈 */
`;

const ParticipantList = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto; /* 가로 스크롤 */
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%; /* 원형 이미지 */
  object-fit: cover; /* 이미지 비율 유지 */
  border: 2px solid #ddd; /* 테두리 추가 */
`;

function PostDetail() {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.userSlice);
  const { post } = useSelector((state: RootState) => state.postSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isOwner = user.userId === post?.userId;

  useEffect(() => {
    if (!post) {
      navigate("/");
    }
  }, [post, navigate]);

  const handlerRedirect = () => {
    navigate(`/post/${id}/update`);
  };

  const startRunning = async () => {
    if (!post) return;

    try {
      const docRef = doc(db, "posts", post.id ?? "");

      if (!post.isRunning) {
        dispatch(
          postActions.setPost({
            ...post,
            isRunning: true,
          })
        );
        await updateDoc(docRef, {
          isRunning: true,
        });

        alert("러닝 하겠습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleParticipant = async () => {
    if (!user.userId) {
      navigate("/login");
      return;
    }
    if (!post) return;
    if (post.participantList.length === 5) return;

    for (const participant of post.participantList) {
      if (participant.userId === user.userId) {
        alert("이미 참여 했습니다");
        return;
      }
    }

    try {
      const docRef = doc(db, "posts", post.id ?? "");

      setLoading(true);

      await updateDoc(docRef, {
        participantList: [...post.participantList, user],
      });

      dispatch(
        postActions.setPost({
          ...post,
          participantList: [...post.participantList, user],
        })
      );
      setLoading(false);
      alert("참여 했습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {loading && (
        <LoadingContainer>
          <BeatLoader />
        </LoadingContainer>
      )}
      <Helmet>
        <title>Running Crew - {`${post?.title}`}</title>
      </Helmet>
      <Post>
        <PostImageBox>{post?.imgUrl && <PostImage src={post.imgUrl} />}</PostImageBox>
        <PostTitle>{post?.title}</PostTitle>
        <PostText>{post?.description}</PostText>
        <PostDate>{post?.runningDate} 날에 러닝 합니다</PostDate>
        <ButtonContainer>
          {isOwner ? (
            <>
              <Btn onClick={handlerRedirect}>수정 하기</Btn>{" "}
              {!post.isRunning && (
                <Btn className="running-btn" onClick={startRunning}>
                  러닝 하기
                </Btn>
              )}
            </>
          ) : (
            <Btn onClick={handleParticipant} disabled={post?.participantList.length === 5}>
              {post?.participantList.length === 5 ? "참여 마감" : "참여 하기"}
            </Btn>
          )}
        </ButtonContainer>
        {post?.participantList && (
          <>
            <ParticipantCount>참여자 {post.participantList.length}명</ParticipantCount>
            <ParticipantList>
              {post.participantList.map((participant) => (
                <ProfileImage
                  key={participant.userId}
                  src={participant.photoUrl}
                  alt="참가자 프로필 이미지"
                  title={participant.userName}
                />
              ))}
            </ParticipantList>
          </>
        )}
      </Post>
    </>
  );
}

export default PostDetail;
