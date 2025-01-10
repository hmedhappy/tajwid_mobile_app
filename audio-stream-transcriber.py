from transformers import pipeline
from pydub import AudioSegment
import speech_recognition as sr
import tempfile
import time
from pynput import keyboard  # Using pynput for key press detection

# Specify the path to the local cloned model
local_model_path = "./whisper-base-ar-quran"

# Initialize the pipeline with the local model and disable timestamps
pipe = pipeline("automatic-speech-recognition", model=local_model_path, return_timestamps=False)

# Original text for comparison
original_text = "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"

# Function to remove diacritics (CHAKL) from Arabic text
def remove_diacritics(text):
    diacritics = ['\u064B', '\u064C', '\u064D', '\u064E', '\u064F', '\u0650', '\u0651', '\u0652']
    return ''.join([char for char in text if char not in diacritics])

# Compare transcriptions and give scores
def compare_transcriptions(original, transcribed):
    scores = []
    original_words = original.split()
    transcribed_words = transcribed.split()
    removed_diacritics_text_original = remove_diacritics(original)
    removed_diacritics_text_transcribed = remove_diacritics(transcribed)
    original_words_no_diacritics = removed_diacritics_text_original.split()
    transcribed_words_no_diacritics = removed_diacritics_text_transcribed.split()

    for orig_word, trans_word in zip(original_words, transcribed_words):
        if orig_word == trans_word:
            scores.append((orig_word, "GREEN"))
        elif remove_diacritics(orig_word) == remove_diacritics(trans_word):
            scores.append((orig_word, "YELLOW"))
        else:
            scores.append((orig_word, "RED"))

    return scores

# Function to record audio and save it as a WAV file
def record_audio():
    recognizer = sr.Recognizer()
    audio_data = []  # List to store audio chunks

    with sr.Microphone() as source:
        print("Recording... Speak now. Press ENTER to stop.")
        recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise

        # Start listening to audio
        while True:
            audio_chunk = recognizer.listen(source, timeout=5)  # timeout avoids indefinite blocking
            audio_data.append(audio_chunk)
            print("Recording chunk... Press ENTER to stop.")

            # Check if Enter is pressed to stop listening
            if enter_pressed[0]:  # Use the shared variable to check for the key press
                print("Recording stopped.")
                break

    # Combine all audio chunks into a single audio file
    combined_audio = b''.join([chunk.get_wav_data() for chunk in audio_data])

    # Save the combined audio to a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    with open(temp_file.name, "wb") as f:
        f.write(combined_audio)

    return temp_file.name

# Function to transcribe audio
def transcribe_audio(audio_path):
    try:
        # Standardize audio for the model (16kHz, mono channel)
        standardized_audio_path = "standardized_audio.wav"
        audio = AudioSegment.from_file(audio_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        audio.export(standardized_audio_path, format="wav")

        # Get the transcription result
        result = pipe(standardized_audio_path)
        return result['text']
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

# Shared variable to detect key press
enter_pressed = [False]

# Define a listener for key presses
def on_press(key):
    try:
        if key == keyboard.Key.enter:  # Detect the Enter key press
            enter_pressed[0] = True
    except AttributeError:
        pass

def on_release(key):
    pass

# Set up the listener for key events
listener = keyboard.Listener(on_press=on_press, on_release=on_release)
listener.start()

# Main loop to record and process audio
while True:
    print("Press 'Enter' to start recording or type 'exit' to quit.")
    user_input = input("> ")

    if user_input.lower() == 'exit':
        print("Exiting the program.")
        listener.stop()  # Stop the listener before exiting
        break

    try:
        # Record audio
        audio_path = record_audio()
        # Transcribe the audio
        transcription = transcribe_audio(audio_path)
        if transcription:
            print(f"Transcribed Text: {transcription}")
            print(f"Original Text: {original_text}")
            print("Comparison Results:")
            # Compare with the original text
            scores = compare_transcriptions(original_text, transcription)
            for word, score in scores:
                print(f"{word}: {score}")
        else:
            print("No transcription result.")
    except Exception as e:
        print(f"Error: {e}.")
