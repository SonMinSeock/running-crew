import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0px 20px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #979797;
`;

export const Input = styled.input`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  background-color: #fff;
  border: 1px solid #979797;
  border-radius: 8px;
  height: 43px;
  padding: 5px 10px;
  &::placeholder {
    font-size: 16px;
    color: #979797;
  }
`;
