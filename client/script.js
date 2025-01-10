const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const audioContainer = document.getElementById("audioContainer");

let mediaRecorder;
let audioChunks = [];

startBtn.addEventListener("click", async () => {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    startBtn.disabled = true;
    stopBtn.disabled = false;

    audioChunks = []; // Reset chunks for the new recording

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
  } catch (error) {
    console.error("Error accessing microphone:", error);
    alert(
      "An error occurred while trying to access your microphone. Please check your device settings."
    );
  }
});

stopBtn.addEventListener("click", () => {
  try {
    if (!mediaRecorder) {
      throw new Error("MediaRecorder is not initialized.");
    }

    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;

    mediaRecorder.onstop = async () => {
      try {
        console.log("Recording stopped.");
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioChunks = []; // Clear the chunks

        // Generate a URL for the Blob
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create an audio element and set its source
        const audioElement = document.createElement("audio");
        audioElement.controls = true;
        audioElement.src = audioUrl;

        // Clear the container and add the new audio player
        audioContainer.innerHTML = ""; // Clear previous players
        audioContainer.appendChild(audioElement);

        // Send the audio blob to the backend
        await sendAudioToServer(audioBlob);
        console.log("Audio sent successfully.");
        debugger;
      } catch (error) {
        console.error("Error processing recorded audio:", error);
        alert("An error occurred while processing your recording.");
      }
    };
  } catch (error) {
    console.error("Error stopping the recording:", error);
    alert("An error occurred while stopping the recording.");
  }
});

async function sendAudioToServer(audioBlob) {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    console.log("Sending audio to server...");

    const response = await axios.post(
      "http://localhost:5600/process_audio",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper content type for file upload
        },
      }
    );
    console.log("Server Response:", response.data);
    // Highlight text based on the result
    // highlightText(response.data.results);
  } catch (error) {
    console.error("Error preparing audio for upload:", error);
    alert("An unexpected error occurred while preparing the audio.");
  }
}

function highlightText(results) {
  try {
    const arabicText = document.getElementById("arabic-text");
    const words = arabicText.textContent.split(" ");
    arabicText.innerHTML = ""; // Clear the current text

    results.forEach((result, index) => {
      const span = document.createElement("span");
      span.textContent = words[index] + " ";
      span.style.color =
        result === "GREEN" ? "green" : result === "YELLOW" ? "orange" : "red";
      arabicText.appendChild(span);
    });
  } catch (error) {
    console.error("Error highlighting text:", error);
    alert("An error occurred while highlighting the text.");
  }
}
