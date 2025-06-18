import { saveToLocal, loadFromLocal  } from '../services/StorageService';
import { log, logError,  logWarn } from '../utils/log';


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
        }, 1000);    
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
        }, 1000);
    }
  },
};



/*
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
*/

const handledMessageIds = new Set<number>();

export async function handleUnityMessage(raw: string) {
  try {
    //log(`handleUnityMessage : 수신 메시지 내용: ${raw}`);
    const msg = JSON.parse(raw);
    const { type, id, ...rest } = msg;
  
    if (handledMessageIds.has(msg.id)) {
      logWarn(`⚠️ 중복 메시지 ID: ${msg.id} → 무시`);
      return;
    }

    handledMessageIds.add(msg.id);

    // 1️⃣ 콜백 등록까지 대기 (최대 1초)
    //await waitForCallbackRegistration(id, 1000);  // 1초까지 기다림

    // 2️⃣ data 문자열이면 JSON으로 파싱
    let payload: any = { ...rest };
    if (typeof payload.data === 'string') {
      try {
        payload.data = JSON.parse(payload.data);
        log(`data 문자열 → 객체 파싱 성공`);
      } catch {
        logWarn(`data 필드 이중 파싱 실패`);
      }
    }

    // 3️⃣ 핸들러 호출
    const handler = unityMessageHandlers[type];
    if (handler) {
      handler(payload, id);
    } else {
      logWarn(`정의되지 않은 메시지 타입: ${type}`);
    }
  } catch (e) {
    logError(`handleUnityMessage 오류: ${e}`);
  }
}

/*
function waitForCallbackRegistration(id: number, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearInterval(interval);
      logWarn(`[TS] 콜백 등록 지연됨: id=${id}`);
      resolve();  // 초과 시에도 일단 넘기면서 로그 남김
    }, timeout);

    const interval = setInterval(() => {
      if (window.dictMessageCallbacks?.[id]) {
        clearTimeout(timer);
        clearInterval(interval);
        resolve();
      }
    }, 20);
  });
}*/