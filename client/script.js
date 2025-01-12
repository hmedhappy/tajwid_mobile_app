const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const audioContainer = document.getElementById("audioContainer");
const arabicTextContainer = document.querySelector(".rainbow");

const surahSelect = document.getElementById("surah-select");
const ayahSelect = document.getElementById("ayah-select");

const arabicText = document.getElementById("arabic-text");

let mediaRecorder;
let audioChunks = [];
let originalText = "";

async function handleStart() {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    // Start recorder animation
    triggerRecorderAnimation();

    mediaRecorder.onstop = () => {
      try {
        console.log("Recording stopped.");
        sendAudioToServer(); // Send the audio blob to the backend
        console.log("Audio sent successfully.");
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

function load_ayat() {
  fetch("http://localhost:5600/get-transcripts")
    .then((response) => response.json())
    .then((data) => {
      const transcripts = {}; // Initialize the transcripts object
      const sourats = [
        {
          id: 1,
          name: "الفاتحة",
          total_verses: 7,
        },
        {
          id: 2,
          name: "البقرة",
          total_verses: 286,
        },
        {
          id: 3,
          name: "آل عمران",
          total_verses: 200,
        },
        {
          id: 4,
          name: "النساء",
          total_verses: 176,
        },
        {
          id: 5,
          name: "المائدة",
          total_verses: 120,
        },
        {
          id: 6,
          name: "الأنعام",
          total_verses: 165,
        },
        {
          id: 7,
          name: "الأعراف",
          total_verses: 206,
        },
        {
          id: 8,
          name: "الأنفال",
          total_verses: 75,
        },
        {
          id: 9,
          name: "التوبة",
          total_verses: 129,
        },
        {
          id: 10,
          name: "يونس",
          total_verses: 109,
        },
        {
          id: 11,
          name: "هود",
          total_verses: 123,
        },
        {
          id: 12,
          name: "يوسف",
          total_verses: 111,
        },
        {
          id: 13,
          name: "الرعد",
          total_verses: 43,
        },
        {
          id: 14,
          name: "ابراهيم",
          total_verses: 52,
        },
        {
          id: 15,
          name: "الحجر",
          total_verses: 99,
        },
        {
          id: 16,
          name: "النحل",
          total_verses: 128,
        },
        {
          id: 17,
          name: "الإسراء",
          total_verses: 111,
        },
        {
          id: 18,
          name: "الكهف",
          total_verses: 110,
        },
        {
          id: 19,
          name: "مريم",
          total_verses: 98,
        },
        {
          id: 20,
          name: "طه",
          total_verses: 135,
        },
        {
          id: 21,
          name: "الأنبياء",
          total_verses: 112,
        },
        {
          id: 22,
          name: "الحج",
          total_verses: 78,
        },
        {
          id: 23,
          name: "المؤمنون",
          total_verses: 118,
        },
        {
          id: 24,
          name: "النور",
          total_verses: 64,
        },
        {
          id: 25,
          name: "الفرقان",
          total_verses: 77,
        },
        {
          id: 26,
          name: "الشعراء",
          total_verses: 227,
        },
        {
          id: 27,
          name: "النمل",
          total_verses: 93,
        },
        {
          id: 28,
          name: "القصص",
          total_verses: 88,
        },
        {
          id: 29,
          name: "العنكبوت",
          total_verses: 69,
        },
        {
          id: 30,
          name: "الروم",
          total_verses: 60,
        },
        {
          id: 31,
          name: "لقمان",
          total_verses: 34,
        },
        {
          id: 32,
          name: "السجدة",
          total_verses: 30,
        },
        {
          id: 33,
          name: "الأحزاب",
          total_verses: 73,
        },
        {
          id: 34,
          name: "سبإ",
          total_verses: 54,
        },
        {
          id: 35,
          name: "فاطر",
          total_verses: 45,
        },
        {
          id: 36,
          name: "يس",
          total_verses: 83,
        },
        {
          id: 37,
          name: "الصافات",
          total_verses: 182,
        },
        {
          id: 38,
          name: "ص",
          total_verses: 88,
        },
        {
          id: 39,
          name: "الزمر",
          total_verses: 75,
        },
        {
          id: 40,
          name: "غافر",
          total_verses: 85,
        },
        {
          id: 41,
          name: "فصلت",
          total_verses: 54,
        },
        {
          id: 42,
          name: "الشورى",
          total_verses: 53,
        },
        {
          id: 43,
          name: "الزخرف",
          total_verses: 89,
        },
        {
          id: 44,
          name: "الدخان",
          total_verses: 59,
        },
        {
          id: 45,
          name: "الجاثية",
          total_verses: 37,
        },
        {
          id: 46,
          name: "الأحقاف",
          total_verses: 35,
        },
        {
          id: 47,
          name: "محمد",
          total_verses: 38,
        },
        {
          id: 48,
          name: "الفتح",
          total_verses: 29,
        },
        {
          id: 49,
          name: "الحجرات",
          total_verses: 18,
        },
        {
          id: 50,
          name: "ق",
          total_verses: 45,
        },
        {
          id: 51,
          name: "الذاريات",
          total_verses: 60,
        },
        {
          id: 52,
          name: "الطور",
          total_verses: 49,
        },
        {
          id: 53,
          name: "النجم",
          total_verses: 62,
        },
        {
          id: 54,
          name: "القمر",
          total_verses: 55,
        },
        {
          id: 55,
          name: "الرحمن",
          total_verses: 78,
        },
        {
          id: 56,
          name: "الواقعة",
          total_verses: 96,
        },
        {
          id: 57,
          name: "الحديد",
          total_verses: 29,
        },
        {
          id: 58,
          name: "المجادلة",
          total_verses: 22,
        },
        {
          id: 59,
          name: "الحشر",
          total_verses: 24,
        },
        {
          id: 60,
          name: "الممتحنة",
          total_verses: 13,
        },
        {
          id: 61,
          name: "الصف",
          total_verses: 14,
        },
        {
          id: 62,
          name: "الجمعة",
          total_verses: 11,
        },
        {
          id: 63,
          name: "المنافقون",
          total_verses: 11,
        },
        {
          id: 64,
          name: "التغابن",
          total_verses: 18,
        },
        {
          id: 65,
          name: "الطلاق",
          total_verses: 12,
        },
        {
          id: 66,
          name: "التحريم",
          total_verses: 12,
        },
        {
          id: 67,
          name: "الملك",
          total_verses: 30,
        },
        {
          id: 68,
          name: "القلم",
          total_verses: 52,
        },
        {
          id: 69,
          name: "الحاقة",
          total_verses: 52,
        },
        {
          id: 70,
          name: "المعارج",
          total_verses: 44,
        },
        {
          id: 71,
          name: "نوح",
          total_verses: 28,
        },
        {
          id: 72,
          name: "الجن",
          total_verses: 28,
        },
        {
          id: 73,
          name: "المزمل",
          total_verses: 20,
        },
        {
          id: 74,
          name: "المدثر",
          total_verses: 56,
        },
        {
          id: 75,
          name: "القيامة",
          total_verses: 40,
        },
        {
          id: 76,
          name: "الانسان",
          total_verses: 31,
        },
        {
          id: 77,
          name: "المرسلات",
          total_verses: 50,
        },
        {
          id: 78,
          name: "النبإ",
          total_verses: 40,
        },
        {
          id: 79,
          name: "النازعات",
          total_verses: 46,
        },
        {
          id: 80,
          name: "عبس",
          total_verses: 42,
        },
        {
          id: 81,
          name: "التكوير",
          total_verses: 29,
        },
        {
          id: 82,
          name: "الإنفطار",
          total_verses: 19,
        },
        {
          id: 83,
          name: "المطففين",
          total_verses: 36,
        },
        {
          id: 84,
          name: "الإنشقاق",
          total_verses: 25,
        },
        {
          id: 85,
          name: "البروج",
          total_verses: 22,
        },
        {
          id: 86,
          name: "الطارق",
          total_verses: 17,
        },
        {
          id: 87,
          name: "الأعلى",
          total_verses: 19,
        },
        {
          id: 88,
          name: "الغاشية",
          total_verses: 26,
        },
        {
          id: 89,
          name: "الفجر",
          total_verses: 30,
        },
        {
          id: 90,
          name: "البلد",
          total_verses: 20,
        },
        {
          id: 91,
          name: "الشمس",
          total_verses: 15,
        },
        {
          id: 92,
          name: "الليل",
          total_verses: 21,
        },
        {
          id: 93,
          name: "الضحى",
          total_verses: 11,
        },
        {
          id: 94,
          name: "الشرح",
          total_verses: 8,
        },
        {
          id: 95,
          name: "التين",
          total_verses: 8,
        },
        {
          id: 96,
          name: "العلق",
          total_verses: 19,
        },
        {
          id: 97,
          name: "القدر",
          total_verses: 5,
        },
        {
          id: 98,
          name: "البينة",
          total_verses: 8,
        },
        {
          id: 99,
          name: "الزلزلة",
          total_verses: 8,
        },
        {
          id: 100,
          name: "العاديات",
          total_verses: 11,
        },
        {
          id: 101,
          name: "القارعة",
          total_verses: 11,
        },
        {
          id: 102,
          name: "التكاثر",
          total_verses: 8,
        },
        {
          id: 103,
          name: "العصر",
          total_verses: 3,
        },
        {
          id: 104,
          name: "الهمزة",
          total_verses: 9,
        },
        {
          id: 105,
          name: "الفيل",
          total_verses: 5,
        },
        {
          id: 106,
          name: "قريش",
          total_verses: 4,
        },
        {
          id: 107,
          name: "الماعون",
          total_verses: 7,
        },
        {
          id: 108,
          name: "الكوثر",
          total_verses: 3,
        },
        {
          id: 109,
          name: "الكافرون",
          total_verses: 6,
        },
        {
          id: 110,
          name: "النصر",
          total_verses: 3,
        },
        {
          id: 111,
          name: "المسد",
          total_verses: 5,
        },
        {
          id: 112,
          name: "الإخلاص",
          total_verses: 4,
        },
        {
          id: 113,
          name: "الفلق",
          total_verses: 5,
        },
        {
          id: 114,
          name: "الناس",
          total_verses: 6,
        },
      ];

      for (const entry of data) {
        const { path, duration, transcript } = entry;

        // Extract Surah and Ayah from the path, assuming it's structured like "001001" (Surah 001, Ayah 001)
        const surah = path.split("/")[2].split(".")[0].slice(0, 3);
        const ayah = path.split("/")[2].split(".")[0].slice(3);

        // Find the name and ID of the sourat based on the surah
        const sourat = sourats.find((s) => s.id === parseInt(surah));
        const id = path.split("/")[2].split(".")[0]; // Extract the ID from file name

        if (!transcripts[surah]) transcripts[surah] = {};
        transcripts[surah][ayah] = {
          transcript,
          duration,
          sourat: sourat.name,
          id,
        };
      }

      // Populate Surah Select dropdown
      Object.keys(transcripts).forEach((surahId, index) => {
        const surahData = transcripts[surahId]["001"];
        const option = document.createElement("option");
        option.value = surahId; // Use the string ID here
        option.textContent = `Surah ${surahData.sourat}`;
        surahSelect.appendChild(option);
      });

      // Handle Surah selection change
      surahSelect.addEventListener("change", (event) => {
        const selectedSurahId = event.target.value;
        const selectedSurah = transcripts[selectedSurahId];

        // Populate Ayah Select dropdown based on the selected Surah
        ayahSelect.innerHTML = ""; // Clear previous options

        if (selectedSurah) {
          // Assuming you have a list of Ayahs in the selected Surah (you may need to update this logic)
          const ayahCount = Object.keys(selectedSurah)?.length; // Example: 10 Ayahs, replace with actual number or dynamic data

          for (let ayahNumber = 1; ayahNumber <= ayahCount; ayahNumber++) {
            const option = document.createElement("option");
            option.value = ayahNumber;
            option.textContent = `Ayah ${ayahNumber}`;
            ayahSelect.appendChild(option);
          }
        }
      });

      // Handle Surah selection change
      ayahSelect.addEventListener("change", (event) => {
        const selectedSurahId = surahSelect.value;
        const selectedAyahNumber = event.target.value.padStart(3, "0"); // Zero-pad the Ayah number
        const selectedAyah = transcripts[selectedSurahId][selectedAyahNumber];

        if (selectedAyah) {
          // Display the selected Ayah in the main text
          arabicText.textContent = selectedAyah.transcript;
          // Set the original text to be sent to the server
          originalText = selectedAyah.transcript;
        }
      });
    })
    .catch((error) => {
      console.error("Error loading ayat:", error);
    });
}

function handleStop() {
  try {
    if (!mediaRecorder) {
      throw new Error("MediaRecorder is not initialized.");
    }
    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;

    // Remove recorder animation when stopped
    arabicTextContainer.classList.remove("recording");
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
  formData.append("original_text", originalText); // Append the original text

  console.log("Sending audio to server...");

  try {
    const response = await fetch("http://localhost:5600/process_audio", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    // Trigger animation for 3 seconds after the server request
    await triggerRainbowAnimation();

    // Highlight text based on server results
    highlightText(data.results);
    displayTranscription(data.transcription);
    await triggerRainbowAnimation("stop");
  } catch (error) {
    console.error("Error during file upload:", error);
    alert("An error occurred while uploading the audio.");
  }
}

function highlightText(results) {
  try {
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

function displayTranscription(transcriptionText) {
  try {
    const transcriptionSection = document.getElementById("transcription-text");
    transcriptionSection.innerHTML = transcriptionText; // Update the innerHTML with the highlighted words
  } catch (error) {
    console.error("Error displayTranscription text:", error);
    alert("An error occurred while displayTranscription.");
  }
}

async function triggerRainbowAnimation(exit) {
  if (exit) {
    arabicTextContainer.classList.remove("animate");
    return;
  }
  // Add the animation class
  arabicTextContainer.classList.add("animate");
}

function triggerRecorderAnimation() {
  // Add a recording animation class
  arabicTextContainer.classList.add("recording");
}

function handleSubmit(event) {
  // Prevent the default form submission behavior
  event.preventDefault();
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
