import { CiImageOn } from "react-icons/ci";

import {
  AttatchFileInput,
  AttatchFileSection,
  Form,
  PreviewBox,
  PreviewContainer,
  PreviewImage,
  PreviewText,
  RemoveButton,
  Span,
  SubmitBtn,
  Textarea,
  TitleInput,
} from "../../components/Form";
import { useState } from "react";

function PostCreate() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const FILE_UPLOAD_SIZE = 1 * 1024 * 1024; // 1MB
  const MAX_UPLOAD_COUNT = 3; // 최대 파일 업로드 수

  const handleClickFileInput = () => {
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // 파일 입력 창 열기
    }
  };

  const handleDragStart = () => setIsDragActive(true);
  const handleDragEnd = () => setIsDragActive(false);
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault(); // 기본 이벤트 방지
    setIsDragActive(false); // 드래그 상태 비활성화

    const files = Array.from(event.dataTransfer.files); // 드롭된 파일 가져오기
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]); // 상태 업데이트
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.size <= FILE_UPLOAD_SIZE && file.type.startsWith("image/"));

    if (uploadedFiles.length + validFiles.length > MAX_UPLOAD_COUNT) {
      alert(`최대 ${MAX_UPLOAD_COUNT}개의 파일만 업로드 가능합니다.`);
      return;
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (file: File) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((uploadedFile) => uploadedFile !== file);
      return updatedFiles;
    });
  };
  return (
    <Form>
      <section>
        <TitleInput placeholder="러닝 모집 제목 작성해 주세요" />
      </section>
      <section>
        <Textarea rows={12} placeholder="러닝 모집글 작성해 주세요" />
      </section>
      <AttatchFileSection
        onClick={handleClickFileInput}
        onDragEnter={handleDragStart}
        onDragLeave={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={isDragActive ? "isDragActive" : ""}
      >
        <CiImageOn />
        <Span>클릭 또는 드래그 이미지 업로드</Span>
        <AttatchFileInput id="file" type="file" accept="image/*" onChange={handleFileChange} />
      </AttatchFileSection>

      {/* 이미지 미리보기 */}
      <PreviewContainer>
        {uploadedFiles.map((file) => (
          <PreviewBox key={file.name}>
            {file.type.startsWith("image/") ? (
              <PreviewImage src={URL.createObjectURL(file)} alt={file.name} />
            ) : (
              <PreviewText>{file.name}</PreviewText>
            )}
            <RemoveButton onClick={() => handleRemoveFile(file)}>×</RemoveButton>
          </PreviewBox>
        ))}
      </PreviewContainer>

      <SubmitBtn>게시</SubmitBtn>
    </Form>
  );
}

export default PostCreate;
