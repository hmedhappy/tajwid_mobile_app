# Audio Transcription and Comparison System

This repository provides an end-to-end solution for transcribing Arabic audio using the Whisper model and comparing the transcriptions with an original text. The system also includes audio recording and streaming capabilities.

## Features

- **Automatic Speech Recognition (ASR)**: Utilizes the Whisper model to transcribe Arabic audio into text.
- **Audio Recording**: Records audio via the microphone and processes it for transcription.
- **Audio Standardization**: Standardizes the audio format (e.g., sample rate, mono channel) to ensure compatibility with the transcription model.
- **Diacritic Removal**: Removes Arabic diacritics (CHAKL) to normalize the text before comparison.
- **Text Comparison**: Compares the transcribed text with an original text and provides a score for each word (`GREEN`, `YELLOW`, `RED`) based on exact match and diacritic differences.


### Prerequisites

- Python 3.8 or higher
- Install required libraries using `pip`:

## Setup Instructions

```bash
pip install transformers pydub speechrecognition pyaudio pynput Flask flask-cors
```

### Model Download

Ensure that you have the Whisper model available locally or specify the correct path in the script. The model can be downloaded from Hugging Face and saved to a directory.

```bash
git clone https://huggingface.co/tarteel-ai/whisper-base-ar-quran
```

## Usage
### Launch Server

```bash
python server/audio-transcriber-server.py
```

### Launch Client

Open the `client/index.html`

### Files Overview

1. **audio-file-transcriber.py**: Script to transcribe audio files and compare the transcription with the original text.
2. **audio-recorder_terminal.py**: A simple terminal-based tool for recording audio, saving it as a WAV file, and playing it back.
3. **audio-stream-transcriber.py**: Streams and records audio, transcribes it in real-time, and compares the transcription with the original text.
4. **audio-transcriber-server.py**: A Flask-based server for uploading audio files, processing them, and returning the transcriptions along with comparison results.


### Transcribing and Comparing Audio

1. Run the script `audio-file-transcriber.py` to transcribe audio from a file and compare the transcription with the original text.

```bash
python audio-file-transcriber.py
```

### Recording Audio from the Microphone

1. Run the script `audio-recorder_terminal.py` to start recording audio from the microphone. The recording will stop automatically after detecting a silence of 2 seconds.

```bash
python audio-recorder_terminal.py
```

2. You can then play the recorded audio using the built-in play function.

### Real-Time Audio Streaming and Transcription

1. Run `audio-stream-transcriber.py` to start recording and transcribing audio in real time. Press the `Enter` key to stop the recording.

```bash
python audio-stream-transcriber.py
```

### Web-Based Transcription Server

1. Run the `audio-transcriber-server.py` to start a Flask server that allows uploading audio files for transcription and comparison.

```bash
python audio-transcriber-server.py
```

2. Send a `POST` request to `http://localhost:5000/upload` with the audio file to get the transcription and comparison result.

Example using a `form-data` with `postman`:

```bash
key = audio
value = file.(wav-mp3)
```

## Text Comparison

The comparison between the original and transcribed texts will be displayed with the following color codes:

- **GREEN**: Exact match.
- **YELLOW**: Match without diacritics.
- **RED**: No match.

The original text for comparison is:

```
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
or
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [Whisper Model](https://huggingface.co/openai/whisper)
- [pydub](https://pydub.com/)
- [Flask](https://flask.palletsprojects.com/)
- [SpeechRecognition](https://pypi.org/project/SpeechRecognition/)
