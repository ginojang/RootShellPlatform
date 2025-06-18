
import { log, logError, logSuccess, logWarn } from '../utils/log';


export type StoragePayload = {
  folder?: string;      // 저장 경로처럼 쓸 prefix
  filename: string;     // 저장 파일명
  data: any;            // 저장할 JSON 데이터
};

export function saveToLocal({ folder, filename, data }: StoragePayload): void {
  
  try {
    const json = JSON.stringify(data, null, 2);
    const fullName = folder ? `${folder}_${filename}` : filename;

    log(` 💾 저장 시도: ${fullName}`);
    //log(` ✅✅✅${json}`);

    // 실제 저장
    localStorage.setItem(fullName, json);

    // 저장 후 확인
    //const verify = localStorage.getItem(fullName);
    //log(` ✅ 저장 확인: ${fullName} = ${verify}`);
  } catch (err) {
    logError(` JSON 저장 실패: ${err}`);
  }
}

export function loadFromLocal({ folder, filename }: { folder?: string; filename: string }): string | null {

  try {

    //deleteAllLocalStorage();

    const fullName = folder ? `${folder}_${filename}` : filename;
    const json = localStorage.getItem(fullName);
    
    if (json) {
      log(` 📤 로드 완료: ${fullName}`);
      return json;
    } else {
      logWarn(`파일 없음 또는 값 없음: ${fullName}`);
      return null;
    }
  } catch (err) {
    logError(`JSON 로드 실패: ${err}`);
    return null;
  }
}


export function deleteAllLocalStorage(): void {
  try {
    localStorage.clear();
    logSuccess("모든 localStorage 삭제 완료");
  } catch (err) {
    logError(`전체 삭제 실패: ${err}`);
  }
}

/*
//
deleteAllLocalFiles("player_"); // "player_"로 시작하는 키만 삭제
deleteAllLocalFiles();          // prefix 없이 전체 검사 (전체 삭제 아님!)

//
export function deleteAllLocalFiles(prefix: string = ""): void {
  try {
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`🗑️ 삭제됨: ${key}`);
    });

    console.log(`✅ ${keysToDelete.length}개 파일 삭제 완료`);
  } catch (err) {
    console.error("❌ 파일 삭제 중 오류 발생:", err);
  }
}

*/

export async function saveToIndexedDB() {  }

export async function saveToFirebase() {  }

