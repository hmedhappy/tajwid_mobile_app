import pyaudio
import wave
import numpy as np
import threading
import sys
from playsound import playsound
import importlib.util

# Define the audio parameters
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
AUDIO_FILE = "recorded_audio.wav"
SILENCE_THRESHOLD = 1000  # The volume threshold to detect silence (adjust as needed)
SILENCE_DURATION = 2  # Duration of silence in seconds to stop recording

# Load the module dynamically
module_name = "audio-transcriber"
module_path = "audio-transcriber.py"

spec = importlib.util.spec_from_file_location(module_name, module_path)
transcriber_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(transcriber_module)

# Initialize the audio stream
p = pyaudio.PyAudio()

# Flag to control the recording loop
recording = True

def start_recording(frames):
    print("Recording started...")
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)
    silent_frames = 0
    global recording
    while recording:
        data = stream.read(CHUNK)
        frames.append(data)

        # Convert audio data to numpy array and check for silence
        audio_data = np.frombuffer(data, dtype=np.int16)
        if np.abs(audio_data).mean() < SILENCE_THRESHOLD:
            silent_frames += 1
        else:
            silent_frames = 0

        # Stop recording if silence lasts for specified duration
        if silent_frames > (RATE // CHUNK) * SILENCE_DURATION:
            print("Silence detected for 2 seconds. Stopping recording.")
            break

    stream.stop_stream()
    stream.close()

def save_audio(frames):
    print("Saving audio...")
    with wave.open(AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))

def play_audio():
    print(f"Playing {AUDIO_FILE}...")
    playsound(AUDIO_FILE)

def main():
    global recording
    frames = []
    print("Press ENTER to start recording. Press ENTER again to stop recording.")
    
    input()  # Wait for ENTER to start recording
    
    # Start the recording thread
    recording_thread = threading.Thread(target=start_recording, args=(frames,))
    recording_thread.start()
    
    input()  # Wait for ENTER to stop recording
    recording = False  # Signal the recording thread to stop
    recording_thread.join()  # Wait for the thread to finish

    # Save the audio
    save_audio(frames)

    # Call the start_transcribe function from the dynamically loaded module
    print("Starting transcription...")
    transcriber_module.start_transcribe(AUDIO_FILE)

    # Play the audio after stopping
    play_audio()

if __name__ == "__main__":
    main()
