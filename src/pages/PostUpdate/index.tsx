import "react-calendar/dist/Calendar.css"; // 기본 스타일 가져오기
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
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FormEvent, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { Value } from "react-calendar/dist/esm/shared/types.js";
import { CalenderSection, DateButton } from "../../components/Calender";

function PostUpdate() {
  const user = useSelector((state: RootState) => state.userSlice);
  const { post } = useSelector((state: RootState) => state.postSlice);
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(post?.title);
  const [description, setDescription] = useState(post?.description);
  const [imgUrl, setImgUrl] = useState<string | null>(post?.imgUrl ?? null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택된 날짜
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 캘린더 열림 상태

  const navigate = useNavigate();

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
      setImgUrl(null);
    } else {
      alert(`최대 1개의 파일만 업로드 가능합니다.`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length === 1) {
        setFile(files[0]); // 단일 파일만 추가
        setImgUrl(null);
      } else {
        alert(`최대 1개의 파일만 업로드 가능합니다.`);
      }
    }
  };

  const handleRemoveFile = (file?: File) => {
    if (file) {
      setFile(null);
    } else {
      setImgUrl(null);
    }
  };

  const onValid = () => {
    if (title?.trim().length === 0 && description?.trim().length === 0 && selectedDate) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = onValid();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: { [key: string]: any } = {};

    if (!isValid) {
      alert("제목, 모집글, 러닝 할 날짜를 작성해야 합니다.");
      return;
    }

    try {
      const docRef = doc(db, "posts", post?.id ?? "");
      if (title !== post?.title) {
        updates.title = title;
      }

      if (description !== post?.description) {
        updates.description = description;
      }

      if (selectedDate && selectedDate.toLocaleDateString() !== post?.runningDate) {
        updates.runningDate = selectedDate.toLocaleDateString();
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(docRef, updates);
      }

      if (file) {
        const locationRef = ref(storage, `posts/${user.userId}/${post?.id}`);
        if (post?.imgUrl) {
          await deleteObject(locationRef);
        }

        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(docRef, {
          imgUrl: url,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setTitle("");
    setDescription("");
    setFile(null);

    alert("게시글 수정 성공했습니다.");

    navigate("/");
  };

  const onTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev); // 캘린더 열고 닫기
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value); // 단일 날짜인 경우 처리
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <section>
        <TitleInput placeholder="러닝 모집 제목 작성해 주세요 수정" value={title} onChange={onTitleInputChange} />
      </section>
      <section>
        <Textarea
          rows={12}
          placeholder="러닝 모집글 작성해 주세요 수정"
          value={description}
          onChange={onDescriptionInputChange}
        />
      </section>
      <CalenderSection>
        <DateButton type="button" onClick={toggleCalendar}>
          {selectedDate
            ? `🗓 ${selectedDate.toLocaleDateString()}`
            : post?.runningDate
            ? `🗓 ${post.runningDate}`
            : "🗓 러닝 날짜 선택"}
        </DateButton>
        {isCalendarOpen && (
          <Calendar
            onChange={handleDateChange}
            value={selectedDate || (post?.runningDate ? new Date(post?.runningDate) : null)}
            minDate={new Date()} // 과거 날짜 선택 방지
          />
        )}
      </CalenderSection>
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
      <PreviewContainer>
        {file ? (
          <PreviewBox key={file.name}>
            {file.type.startsWith("image/") ? (
              <PreviewImage src={URL.createObjectURL(file)} alt={file.name} />
            ) : (
              <PreviewText>{file.name}</PreviewText>
            )}
            <RemoveButton onClick={() => handleRemoveFile(file)}>×</RemoveButton>
          </PreviewBox>
        ) : (
          imgUrl && (
            <PreviewBox key={imgUrl}>
              {imgUrl ? <PreviewImage src={imgUrl} alt="업로드 할 이미지" /> : <PreviewText>이미지</PreviewText>}
              <RemoveButton onClick={() => handleRemoveFile()}>×</RemoveButton>
            </PreviewBox>
          )
        )}
      </PreviewContainer>

      <SubmitBtn>수정</SubmitBtn>
    </Form>
  );
}

export default PostUpdate;
