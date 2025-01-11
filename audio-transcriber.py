from transformers import pipeline, WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
import whisperx

# Specify the path to the local cloned model
local_model_path = "./whisper-base-ar-quran"

# Initialize the pipeline with the local model and disable timestamps
pipe = pipeline("automatic-speech-recognition", model=local_model_path, return_timestamps=False)

# Original text for comparison
original_text = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
# original_text = "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"


# Function to standardize audio format
def standardize_audio(input_audio_path, output_audio_path, target_format="wav", target_sample_rate=16000):
    try:
        audio = AudioSegment.from_file(input_audio_path)
        audio = audio.set_frame_rate(target_sample_rate).set_channels(1)
        audio.export(output_audio_path, format=target_format)
        return output_audio_path
    except Exception as e:
        print(f"Error during audio standardization: {e}")
        return None

# Function to transcribe audio
def transcribe_audio(audio_path):
    try:
        standardized_audio_path = "standardized_audio.wav"
        standardized_audio_path = standardize_audio(audio_path, standardized_audio_path)
        if not standardized_audio_path:
            return None
        # Get the transcription result
        result = pipe(standardized_audio_path)
        return result['text']
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

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

    if len(original_words) != len(transcribed_words):
        for trans_word in transcribed_words:
            if trans_word in original_words:
                orig_word = original_words[original_words.index(trans_word)]
                scores.append((orig_word, "GREEN"))
            elif remove_diacritics(trans_word) in original_words_no_diacritics:
                orig_word_no_diacritics = original_words_no_diacritics[original_words_no_diacritics.index(remove_diacritics(trans_word))]
                orig_word = original_words[original_words_no_diacritics.index(orig_word_no_diacritics)]
                scores.append((orig_word, "YELLOW"))
            else:
                scores.append((trans_word, "RED"))
    else:
        for orig_word, trans_word in zip(original_words, transcribed_words):
            if orig_word == trans_word:
                scores.append((orig_word, "GREEN"))
            elif remove_diacritics(orig_word) == remove_diacritics(trans_word):
                scores.append((orig_word, "YELLOW"))
            else:
                scores.append((orig_word, "RED"))

    return scores

# Main loop to keep asking for audio file paths

def start_transcribe(audio_path):
    try:
        # Transcribe the audio
        transcription = transcribe_audio(audio_path)
        if transcription:
            removed_diacritics_text = remove_diacritics(transcription)
            removed_diacritics_text_original = remove_diacritics(original_text)
            print(f"Transcribed Text (text_said): {transcription}")
            print(f"Original Text (text_original): {original_text}")
            print("Comparison Results:")
            # Compare with the original text
            scores = compare_transcriptions(original_text, transcription)
            for word, score in scores:
                print(f"{word}: {score}")
        else:
            print("No transcription result.")
    except Exception as e:
        print(f"Error: {e}. Please make sure the audio file path is correct.")