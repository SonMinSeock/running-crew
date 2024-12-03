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
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  margin-top: 60px;
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

  & .first-column {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: #ddd;
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
