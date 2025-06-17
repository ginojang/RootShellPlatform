import { saveToLocal, loadFromLocal  } from '../services/StorageService';
import { log, logError, logSuccess, logWarn } from '../utils/log';

declare global {
  interface Window {
    unityInstance?: {
      SendMessage: (gameObject: string, methodName: string, parameter: string) => void;
    };
  }
}

// 공통 필드 정의
type UnityJsonMessageBase = {
  id: number;
  type: 'readJson' | 'writeJson';
  file: string;
};

// Write 전용
export type UnityWriteJsonMessage = UnityJsonMessageBase & {
  type: 'writeJson';
  data: any;  // write만 data 필요
};

// Read 전용
export type UnityReadJsonMessage = UnityJsonMessageBase & {
  type: 'readJson';
  // 읽기는 data 필요 없음
};


type UnityMessageHandler = (payload: any, id?: number) => void;

export const unityMessageHandlers: Record<string, UnityMessageHandler> = {


  //
  writeJson: (payload: UnityWriteJsonMessage, id?: number) => {
    log(`Unity writeJson 요청 수신 - msg count id: ${id}`);

    // 파일 저장
    saveToLocal({
      folder: 'userdata',
      filename: payload.file,
      data: payload.data,
    });

    // 응답 보내기
    if (typeof id !== 'undefined' && window.unityInstance) {

      setTimeout(() => {
        window.unityInstance?.SendMessage(
          'RootShellBridge',
          'OnJsonWriteAck',
          JSON.stringify({ id, result: true }))
        }, 500);    
    }
  },

  //
  readJson: (payload: UnityReadJsonMessage, id) => {
    log(`Unity readJson 요청 수신 - msg count id: ${id}`)

    const resultData = loadFromLocal({
      folder: 'userdata',
      filename: payload.file,
    })

    if (typeof id !== 'undefined' && window.unityInstance) {

      setTimeout(() => {
        window.unityInstance?.SendMessage(
          'RootShellBridge',
          'OnJsonReadAck',
          JSON.stringify({ id, data: resultData ?? 'error' })) 
        }, 500);
    }
  },
};


// Unity에서 호출하는 메시지 핸들러
export function handleUnityMessage(raw: string) {
  try {
    log(`handleUnityMessage : 수신 메시지 내용: ${raw}`)

    const msg = JSON.parse(raw);
    const { type, id, ...payload } = msg;

    log(`handleUnityMessage : 파싱된 메시지: ${msg.type}  ${msg.id}  ${msg.data}`)

    const handler = unityMessageHandlers[type];
    if (handler) {
      handler(payload, id); // payload가 실제 writeJson 전체 구조
    } else {
      logWarn(`정의되지 않은 메시지 타입: ${type}`);
    }
  } catch (e) {
    logError(`>>>>  handleUnityMessage  >>>> Unity 메시지 처리 실패: ${e}`);

    
  }
}
