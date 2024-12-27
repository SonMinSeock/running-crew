import styled from "styled-components";

export const Section = styled.section`
  margin: 0 20px;
  margin-bottom: 45px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 19px;
  font-weight: bold;
  margin-top: 60px;
  span {
    margin-top: 1rem;
  }
`;

export const RunningPostList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
  padding-bottom: 80px; /* NavBar 높이만큼 여백 추가 */
`;

export const RunningPost = styled.div`
  display: flex;
  gap: 10px;
  height: 77px;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 부드러운 확대 효과 */

  & .first-column {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: #ddd;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
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

  &:hover {
    background-color: rgba(0, 0, 0, 0.05); /* 연한 회색 배경 */
    transform: scale(1.02); /* 부드러운 확대 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
    cursor: pointer;
  }
`;
