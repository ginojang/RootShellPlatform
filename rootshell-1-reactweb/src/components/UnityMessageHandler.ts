import { saveSystemFile } from '../utils/saveSystem.ts';
import type { SaveSystemPayload } from '../utils/saveSystem.ts';

type UnityMessagePayload = any;
type UnityMessageHandler = (payload: UnityMessagePayload) => void;

export const unityMessageHandlers: Record<string, UnityMessageHandler> = {
    save_system: (payload: SaveSystemPayload) => {
        saveSystemFile(payload);
    },
  
};
