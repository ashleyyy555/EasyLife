declare module 'react-native-vosk' {
    interface VoskRecognizer {
        startListening: () => Promise<void>;
        stopListening: () => Promise<void>;
    }

    interface VoskStatic {
        initModel: (modelPath: string) => Promise<void>;
        createRecognizer: () => Promise<VoskRecognizer>;
        destroyRecognizer: (recognizer: VoskRecognizer) => Promise<void>;
        addListener: (event: string, callback: (result: string) => void) => void;
    }

    const Vosk: VoskStatic;
    export default Vosk;
}