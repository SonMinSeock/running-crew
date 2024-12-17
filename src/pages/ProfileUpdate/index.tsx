import styled from "styled-components";
import { Section } from "../../components/Section/Active";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Label } from "../../components/Form/ProfileUpdateForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, updateDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { userActions } from "../../store/slices/user-slice";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 20px;
  border-bottom: 1px solid #e8e8e8;
  & span {
    font-size: 17px;
    color: #000;
    cursor: pointer;
  }
`;

const ProfileInfoSection = styled(Section)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
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

const Span = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #979797;
`;

function ProfileUpdate() {
  const user = useSelector((state: RootState) => state.userSlice);
  const [username, setUsername] = useState(user.userName);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  const redirect = (path: string) => {
    navigate(path);
  };

  const updateUserPosts = async (newUsername: string) => {
    // batch (Write Batch)는 Firestore에서 여러 문서를 한 번에 수정, 추가, 삭제할 수 있는 기능.
    const batch = writeBatch(db);
    const postsRef = collection(db, "posts");
    const userPostsQuery = query(postsRef, where("userId", "==", user.userId));
    const snapshot = await getDocs(userPostsQuery);

    snapshot.forEach((docSnap) => {
      const postRef = doc(db, "posts", docSnap.id);
      batch.update(postRef, { username: newUsername });
    });

    await batch.commit();
  };

  const onClick = async () => {
    if (username.trim().length === 0) {
      alert("이름을 입력하세요.");
      return;
    }

    try {
      if (username !== user.userName) {
        // 카카오 계정 사용자
        if (user.provider === "kakao") {
          const docRef = doc(db, "users", user.userId);
          await updateDoc(docRef, { userName: username });
        }
        // 구글 계정 사용자
        else if (user.provider === "google") {
          const authUser = auth.currentUser;
          if (!authUser) {
            alert("인증된 사용자를 찾을 수 없습니다.");
            return;
          }
          await updateProfile(authUser, { displayName: username });
        }

        // posts 컬렉션의 username 업데이트
        await updateUserPosts(username);

        dispatch(
          userActions.setUser({
            ...user,
            userName: username,
          })
        );
      }

      alert("프로필이 성공적으로 수정되었습니다.");
      redirect("/profile");
    } catch (error) {
      console.error("프로필 수정 실패: ", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <Header>
        <span onClick={() => redirect("/profile")}>취소</span>
        <span onClick={onClick}>저장</span>
      </Header>
      <ProfileInfoSection>
        <ProfileImgContainer>{user.photoUrl && <img src={user.photoUrl} alt="프로필 이미지" />}</ProfileImgContainer>
        <Span>프로필 수정</Span>
      </ProfileInfoSection>
      <Form>
        <Label>이름</Label>
        <Input placeholder="이름을 입력하세요" value={username} onChange={onChange} />
      </Form>
    </>
  );
}

export default ProfileUpdate;
