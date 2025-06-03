package com.anonymous.easylifeproto;

import android.Manifest;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.*;

import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;
import org.vosk.android.StorageService;
import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;


public class VoskModule extends ReactContextBaseJavaModule implements RecognitionListener {

    private final ReactApplicationContext reactContext;
    private SpeechService speechService;

    public VoskModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "VoskModule";
    }

    public void startListening() {
        if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            Log.e("Vosk", "Microphone permission not granted");
            return;
        }

        StorageService.unpack(reactContext, "model", "model",
                (model) -> {
                    try {
                        Recognizer recognizer = new Recognizer(model, 16000.0f);
                        speechService = new SpeechService(recognizer, 16000.0f);
                        speechService.startListening(this);
                    } catch (IOException e) {
                        Log.e("Vosk", "Failed to start recognition", e);
                    }
                },
                (e) -> Log.e("Vosk", "Model unpack failed", e));
    }

    public void stopListening() {
        if (speechService != null) {
            speechService.stop();
            speechService.shutdown();
            speechService = null;
            Log.d("Vosk", "Stopped listening");
        }
    }
    private void saveTranscript(String text) {
        File file = new File(reactContext.getFilesDir(), "transcript.txt");

        try (FileWriter writer = new FileWriter(file, true)) {
            writer.append(text).append("\n");
            Log.d("Vosk", "Transcript saved to: " + file.getAbsolutePath());
        } catch (IOException e) {
            Log.e("Vosk", "Failed to save transcript", e);
        }
    }


    public void getTranscript(Promise promise) {
        File file = new File(reactContext.getFilesDir(), "transcript.txt");

        try {
            StringBuilder content = new StringBuilder();
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;

            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }

            reader.close();
            promise.resolve(content.toString());

        } catch (IOException e) {
            Log.e("Vosk", "Error reading transcript", e);
            promise.reject("READ_ERROR", "Failed to read transcript.txt", e);
        }
    }

    @Override
    public void onPartialResult(String hypothesis) {
        Log.d("Vosk", "Partial: " + hypothesis);
    }

    @Override
    public void onResult(String hypothesis) {
        Log.d("Vosk", "Result: " + hypothesis);
    }

    @Override
    public void onFinalResult(String hypothesis) {
        Log.d("Vosk", "Final: " + hypothesis);
        saveTranscript(hypothesis);
    }

    @Override
    public void onError(Exception e) {
        Log.e("Vosk", "Error: ", e);
    }

    @Override
    public void onTimeout() {
        Log.d("Vosk", "Timeout");
    }
}
