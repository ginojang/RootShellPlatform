// utils/saveSystem.ts

export type SaveSystemPayload = {
  folder: string;
  filename: string;
  data: any;
};

export function saveSystemFile({ folder, filename, data }: SaveSystemPayload) {
  const json = JSON.stringify(data, null, 2);
  const fullName = folder ? `${folder}_${filename}` : filename;

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fullName;
  link.click();
  URL.revokeObjectURL(url);

  console.log(`💾 저장 완료: ${fullName}`);
}
