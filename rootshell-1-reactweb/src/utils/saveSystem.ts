export type SaveSystemPayload = {
  folder?: string;      // 저장 경로처럼 쓸 prefix
  filename: string;     // 저장 파일명
  data: any;            // 저장할 JSON 데이터
};

export function saveSystemFile({ folder, filename, data }: SaveSystemPayload): void {
  try {
    const fullName = folder ? `${folder}_${filename}` : filename;
    const json = JSON.stringify(data);
    localStorage.setItem(fullName, json);

    console.log(`💾 전체 메시지 저장 성공: ${fullName}`);
  } catch (err) {
    console.error("❌ JSON 저장 실패:", err);
  }
}