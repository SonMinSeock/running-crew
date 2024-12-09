import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "../../store";

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
`;

const Btn = styled.button`
  background-color: #cffd4f;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  width: 80px;
  padding: 8px 0;
  cursor: pointer;
`;

function PostDetail() {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.userSlice);
  const { post } = useSelector((state: RootState) => state.postSlice);
  const navigate = useNavigate();

  const handlerRedirect = () => {
    navigate(`/post/${id}/update`);
  };

  const isOwner = user.userId === post?.userId;

  return (
    <>
      <Post>
        <PostImageBox>{post?.imgUrl && <PostImage src={post.imgUrl} />}</PostImageBox>
        <PostTitle>{post?.title}</PostTitle>
        <PostText>{post?.description}</PostText>
        <PostDate>2024.11.21.목</PostDate>
        <ButtonContainer>
          {isOwner ? <Btn onClick={handlerRedirect}>수정 하기</Btn> : <Btn>참여 하기</Btn>}
        </ButtonContainer>
      </Post>
    </>
  );
}

export default PostDetail;
