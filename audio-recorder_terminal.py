import pyaudio
import wave
import numpy as np
import time
import sys
from playsound import playsound

# Define the audio parameters
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
AUDIO_FILE = "recorded_audio.wav"
SILENCE_THRESHOLD = 1000  # The volume threshold to detect silence (adjust as needed)
SILENCE_DURATION = 2  # Duration of silence in seconds to stop recording

# Initialize the audio stream
p = pyaudio.PyAudio()

# Create a new wave file
def start_recording():
    print("Recording started...")
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)
    frames = []
    silent_frames = 0
    while True:
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
    return frames

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
    print("Press Enter to start recording. Recording will stop automatically after 2 seconds of silence.")
    
    input()  # Wait for Enter to start recording
    
    frames = start_recording()
    
    # Save the audio
    save_audio(frames)

    # Play the audio after stopping
    play_audio()

if __name__ == "__main__":
    main()
