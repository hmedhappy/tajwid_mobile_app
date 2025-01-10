from flask import Flask, request, jsonify
from flask_cors import CORS

from transformers import pipeline
import os

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Allow 50MB uploads

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# Initialize ASR pipeline
model_path = "./whisper-base-ar-quran"  # Replace with your model path
pipe = pipeline("automatic-speech-recognition", model=model_path, return_timestamps=False)

original_text = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"


def remove_diacritics(text):
    diacritics = ['\u064B', '\u064C', '\u064D', '\u064E', '\u064F', '\u0650', '\u0651', '\u0652']
    return ''.join([char for char in text if char not in diacritics])


def compare_transcriptions(original, transcribed):
    scores = []
    original_words = original.split()
    transcribed_words = transcribed.split()

    for orig_word, trans_word in zip(original_words, transcribed_words):
        if orig_word == trans_word:
            scores.append("GREEN")
        elif remove_diacritics(orig_word) == remove_diacritics(trans_word):
            scores.append("YELLOW")
        else:
            scores.append("RED")
    return scores


@app.route("/process_audio", methods=["POST"])
def process_audio():
    print('Processing API')
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files["audio"]
    audio_path = "uploaded_audio.wav"
    audio_file.save(audio_path)

    try:
        # Transcribe the audio
        transcription = pipe(audio_path)["text"]
        results = compare_transcriptions(original_text, transcription)

        print('result = ',results)
        print('transcription = ',transcription)
        os.remove(audio_path)  # Clean up the file after processing
        return jsonify({"transcription": transcription, "results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5600, debug=True)
