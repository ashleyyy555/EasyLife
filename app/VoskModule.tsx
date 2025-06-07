import { NativeEventEmitter, NativeModules } from "react-native";

class EasyLifeVosk {
    private static instance: EasyLifeVosk;
    public vosk: any;
    public eventEmitter: NativeEventEmitter;

    private constructor() {
        this.vosk = NativeModules.Vosk;
        this.vosk.loadModel('vosk-model-small-en-us-0.15');
        this.eventEmitter = new NativeEventEmitter(this.vosk);
    }

    public static getInstance(): EasyLifeVosk {
        if (!EasyLifeVosk.instance) {
            EasyLifeVosk.instance = new EasyLifeVosk();
        }
        return EasyLifeVosk.instance;
    }

    public addListener(eventName: string, listener: (event: any) => void) {
        this.eventEmitter.addListener(eventName, listener);
    }
}

// singleton
export const EasyLifeVoskModule = EasyLifeVosk.getInstance();

export default EasyLifeVoskModule;