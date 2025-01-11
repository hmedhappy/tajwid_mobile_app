const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const audioContainer = document.getElementById("audioContainer");

let mediaRecorder;
let audioChunks = [];

async function handleStart() {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstop = () => {
      try {
        console.log("Recording stopped.");
        // Send the audio blob to the backend
        sendAudioToServer();
        console.log("Audio sent successfully.");
        // debugger;
      } catch (error) {
        console.error("Error processing recorded audio:", error);
        alert("An error occurred while processing your recording.");
      }
    };

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
}

function handleStop() {
  try {
    if (!mediaRecorder) {
      throw new Error("MediaRecorder is not initialized.");
    }
    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;
  } catch (error) {
    console.error("Error stopping the recording:", error);
    alert("An error occurred while stopping the recording.");
  }
}

async function sendAudioToServer() {
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

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  console.log("Sending audio to server...");

  try {
    const response = await fetch("http://localhost:5600/process_audio", {
      method: "POST",
      body: formData, // FormData automatically sets the correct Content-Type
      // No need to manually set Content-Type for FormData
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    // Example: Highlight the text based on the server's results
    highlightText(data.results);
  } catch (error) {
    console.error("Error during file upload:", error);
    alert("An error occurred while uploading the audio.");
  }
}

function highlightText(results) {
  try {
    const arabicText = document.getElementById("arabic-text");
    const words = arabicText.textContent.split(" ");
    const highlightedHTML = words
      .map((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.color =
          results[index] === "GREEN"
            ? "green"
            : results[index] === "YELLOW"
            ? "orange"
            : "red";
        return span.outerHTML;
      })
      .join(""); // Map each word to a highlighted span and join them into a single string

    arabicText.innerHTML = highlightedHTML; // Update the innerHTML with the highlighted words
  } catch (error) {
    console.error("Error highlighting text:", error);
    alert("An error occurred while highlighting the text.");
  }
}

function handleSubmit(event) {
  // Prevent the default form submission behavior
  event.preventDefault();
  // You can add additional logic here if needed
  console.log("Form submission prevented");
}
