declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any; // Kakao SDK가 제공하는 모든 메소드를 사용할 수 있도록 `any`로 선언
  }
}

export {};

const KAKAO_APP_KEY = "201968d1df739b6d3654e6ccc7fe941a";

export const initializeKakao = (): void => {
  if (!window.Kakao) {
    console.error("Kakao SDK가 로드되지 않았습니다.");
    return;
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY);
  }
};
