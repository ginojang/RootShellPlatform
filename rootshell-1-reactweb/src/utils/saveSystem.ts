export type SaveSystemPayload = {
  folder?: string;      // 저장 경로처럼 쓸 prefix
  filename: string;     // 저장 파일명
  data: any;            // 저장할 JSON 데이터
};

/**
 * 💾 브라우저에서 JSON 파일로 저장 (Blob 기반)
 * → Web 환경에서는 자동 저장 불가능, 다운로드 팝업 발생
 * → Electron/Node.js에서는 fs.writeFile 방식으로 대체 가능
 */
export function saveSystemFile({ folder, filename, data }: SaveSystemPayload): void {
  try {
    //const json = JSON.stringify(data, null, 2);
    const fullName = folder ? `${folder}_${filename}` : filename;

    

    console.log(`✅ saveSystemFile - 호출됨 >> : ${fullName}`);
  } catch (err) {
    console.error("❌ JSON 저장 실패:", err);
  }
}
