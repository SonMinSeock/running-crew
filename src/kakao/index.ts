declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any; // Kakao SDK가 제공하는 모든 메소드를 사용할 수 있도록 `any`로 선언
  }
}

export {};

const KAKAO_APP_KEY = import.meta.env.VITE_APP_KAKAO_APP_KEY;

export const initializeKakao = (): void => {
  if (!window.Kakao) {
    console.error("Kakao SDK가 로드되지 않았습니다.");
    return;
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY);
  }
};

/*
 유저 로그인 -> 카키오 | 구글 -> 유저 데이터 -> { userId, userName, photoUrl }
*/

/*
  구글 -> uid를 userId, displayName을 userName, photoUrl
  카카오 -> id를 userId, nickname을 userName, profile_image_url을 photoUrl
*/
