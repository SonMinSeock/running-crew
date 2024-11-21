import { CiImageOn } from "react-icons/ci";
import {
  AttatchFileInput,
  AttatchFileSection,
  Form,
  Span,
  SubmitBtn,
  Textarea,
  TitleInput,
} from "../../components/Form";

function PostUpdate() {
  const handleClickFileInput = () => {
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // 파일 입력 창 열기
    }
  };
  return (
    <Form>
      <section>
        <TitleInput placeholder="러닝 모집 제목 작성해 주세요 수정" />
      </section>
      <section>
        <Textarea rows={12} placeholder="러닝 모집글 작성해 주세요 수정" />
      </section>
      <AttatchFileSection onClick={handleClickFileInput}>
        <CiImageOn />
        <Span>클릭 또는 드래그 이미지 업로드</Span>
        <AttatchFileInput id="file" type="file" />
      </AttatchFileSection>
      <SubmitBtn>수정</SubmitBtn>
    </Form>
  );
}

export default PostUpdate;
