import styled from "styled-components";
import { Section } from "../../components/Section/Active";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Form, Input, Label } from "../../components/Form/ProfileUpdateForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 20px;
  border-bottom: 1px solid #e8e8e8;
  & span {
    font-size: 17px;
    &.save_text {
      color: #979797;
    }
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  const redirect = (path: string) => {
    navigate(path);
  };
  return (
    <>
      <Header>
        <span onClick={() => redirect("/profile")}>취소</span>
        <span className="save_text">저장</span>
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
