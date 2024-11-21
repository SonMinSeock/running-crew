import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0px 10px;
`;

export const TitleInput = styled.input`
  width: 100%;
  height: 40px;
  background-color: #f6f6f6;
  margin-bottom: 20px;
  padding: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border: 1px solid gray;
  border-radius: 8px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: gray;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  resize: none;
  background-color: #f6f6f6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 10px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: gray;
  }
`;

export const AttatchFileSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 289px;
  border: 1px dashed #979797;
  gap: 20px;
  margin: 20px 0;
  & svg {
    font-size: 38px;
  }
  background-color: #f6f6f6;
  cursor: pointer;
`;

export const Span = styled.span``;

export const AttatchFileInput = styled.input`
  display: none;
`;

export const SubmitBtn = styled.button`
  width: 179px;
  height: 47px;
  border: none;
  background-color: #cffd4f;
  font-weight: bold;
  margin: auto;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  border-radius: 10px;
  font-size: 18px;
`;
