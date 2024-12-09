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
import { FormEvent, useState } from "react";

function PostCreate() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // const FILE_UPLOAD_SIZE = 1 * 1024 * 1024; // 1MB
  const MAX_UPLOAD_COUNT = 1; // 최대 파일 업로드 수

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
    if (files.length > 0) {
      addFiles([files[0]]); // 단일 파일만 추가
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        addFiles([files[0]]); // 단일 파일만 추가
      }
    }
  };

  const addFiles = (files: File[]) => {
    // 이미 업로드된 파일 개수를 확인
    const remainingSlots = MAX_UPLOAD_COUNT - uploadedFiles.length;

    if (remainingSlots <= 0) {
      alert(`최대 ${MAX_UPLOAD_COUNT}개의 파일만 업로드 가능합니다.`);
      return;
    }

    // 유효한 파일 필터링
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    // 업로드 가능한 개수 초과 시 초과 파일 제외
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      alert(`최대 ${remainingSlots}개의 파일만 더 업로드 가능합니다.`);
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
  };

  const handleRemoveFile = (file: File) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((uploadedFile) => uploadedFile !== file);
      return updatedFiles;
    });
  };

  const onValid = () => {
    if (title.trim().length === 0 && description.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = onValid();

    if (!isValid) {
      alert("제목 혹은 모집글 작성해야 합니다.");
      return;
    }
  };

  const onTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <Form onSubmit={onSubmit}>
      <section>
        <TitleInput placeholder="러닝 모집 제목 작성해 주세요" value={title} onChange={onTitleInputChange} />
      </section>
      <section>
        <Textarea
          rows={12}
          placeholder="러닝 모집글 작성해 주세요"
          value={description}
          onChange={onDescriptionInputChange}
        />
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
