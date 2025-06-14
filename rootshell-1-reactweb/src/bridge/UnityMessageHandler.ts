import { saveSystemFile } from '../utils/saveSystem';
import type { SaveSystemPayload } from '../utils/saveSystem';

declare global {
  interface Window {
    unityInstance?: {
      SendMessage: (gameObject: string, methodName: string, parameter: string) => void;
    };
  }
}

// 메시지 타입 정의
type UnityWriteJsonMessage = {
  id: number;
  type: 'writeJson';
  file: string;
  data: any;
};


type UnityMessageHandler = (payload: any, id?: number) => void;

export const unityMessageHandlers: Record<string, UnityMessageHandler> = {
  writeJson: (payload: UnityWriteJsonMessage, id?: number) => {
    console.log(`[Unity] writeJson 요청 수신`, payload);

    // 파일 저장
    saveSystemFile({
      folder: '',
      filename: payload.file,
      data: payload.data,
    });

    // 응답 보내기
    if (typeof id !== 'undefined' && window.unityInstance) {
      window.unityInstance.SendMessage(
        'RootShellBridge',
        'OnJsonWriteAck',
        JSON.stringify({ id, result: true })
      );
    }
  },

  save_system: (payload: SaveSystemPayload) => {
    saveSystemFile(payload);
  },
};

// Unity에서 호출하는 메시지 핸들러
export function handleUnityMessage(raw: string) {
  try {
    //console.log("📩 Unity 원본 메시지:", raw);
    const msg = JSON.parse(raw);

    const { type, id, ...payload } = msg;

    const handler = unityMessageHandlers[type];
    if (handler) {
      handler(payload, id); // payload가 실제 writeJson 전체 구조
    } else {
      console.warn(`⚠️ 정의되지 않은 메시지 타입: ${type}`);
    }
  } catch (e) {
    console.error("❌ Unity 메시지 처리 실패:", e);
  }
}
