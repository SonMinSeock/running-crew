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
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function PostCreate() {
  const user = useSelector((state: RootState) => state.userSlice);
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  // const FILE_UPLOAD_SIZE = 1 * 1024 * 1024; // 1MB

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
    if (files.length === 1) {
      setFile(files[0]); // 단일 파일만 추가
    } else {
      alert(`최대 1개의 파일만 업로드 가능합니다.`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length === 1) {
        setFile(files[0]); // 단일 파일만 추가
      } else {
        alert(`최대 1개의 파일만 업로드 가능합니다.`);
      }
    }
  };

  const handleRemoveFile = (file: File) => {
    if (file) {
      setFile(null);
    }
  };

  const onValid = () => {
    if (title.trim().length === 0 && description.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = onValid();

    if (!isValid) {
      alert("제목 혹은 모집글 작성해야 합니다.");
      return;
    }

    try {
      const doc = await addDoc(collection(db, "posts"), {
        userId: user.userId,
        username: user.userName,
        photoUrl: user.photoUrl,
        title,
        description,
        createdAt: Date.now(),
      });

      if (file) {
        const locationRef = ref(storage, `posts/${user.userId}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          imgUrl: url,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setTitle("");
    setDescription("");
    setFile(null);

    alert("게시글 생성 성공했습니다.");

    navigate("/");
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
        {file && (
          <PreviewBox key={file.name}>
            {file.type.startsWith("image/") ? (
              <PreviewImage src={URL.createObjectURL(file)} alt={file.name} />
            ) : (
              <PreviewText>{file.name}</PreviewText>
            )}
            <RemoveButton onClick={() => handleRemoveFile(file)}>×</RemoveButton>
          </PreviewBox>
        )}
      </PreviewContainer>

      <SubmitBtn>게시</SubmitBtn>
    </Form>
  );
}

export default PostCreate;
