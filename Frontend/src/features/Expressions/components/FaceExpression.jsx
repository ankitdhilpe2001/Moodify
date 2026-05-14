import React, { useCallback, useEffect, useRef, useState } from "react";
import { startCamera, loadFaceLandmarker } from "../utils/cameraUtils";
import { detectExpression } from "../utils/faceUtils";
import { useSong } from "../../home/hook/useSong";

// convert detected expression into mood
const getMoodFromExpression = (label) => {
  const expression = label.toLowerCase();

  if (expression.includes("happy")) return "happy";
  if (expression.includes("sad")) return "sad";
  if (expression.includes("surprise")) return "surprised";

  return "neutral";
};

const FaceExpression = ({ onMoodDetected }) => {
  // refs
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  // custom hook
  const { handleGetSong, loading: songLoading } = useSong();

  // states
  const [expression, setExpression] = useState("Opening camera...");
  const [isPreparing, setIsPreparing] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  // detect face expression
  const handleDetect = useCallback(async () => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    // stop function if something is not ready
    if (
      isPreparing ||
      isDetecting ||
      songLoading ||
      !video ||
      !landmarker
    ) {
      return;
    }

    setIsDetecting(true);
    setExpression("Detecting...");

    try {
      // small delay before detection
      await new Promise((resolve) => setTimeout(resolve, 200));

      // check if video is ready
      if (video.readyState < 2) {
        setExpression("Video not ready");
        return;
      }

      // detect face landmarks
      const result = landmarker.detectForVideo(
        video,
        performance.now()
      );

      // if face is detected
      if (result?.faceBlendshapes?.length > 0) {
        // get expression label
        const label = detectExpression(
          result.faceBlendshapes[0].categories
        );

        // convert expression into mood
        const mood = getMoodFromExpression(label);

        // show detected expression
        setExpression(label);

        onMoodDetected?.(mood);

        // fetch songs based on mood
        await handleGetSong({ mood });
      } else {
        setExpression("No face detected");
      }
    } catch (error) {
      console.error(error);
      setExpression("Detection error");
    } finally {
      setIsDetecting(false);
    }
  }, [handleGetSong, isPreparing, isDetecting, onMoodDetected, songLoading]);

  // initialize camera and model
  useEffect(() => {
    const init = async () => {
      try {
        // start webcam
        streamRef.current = await startCamera(videoRef);

        // load mediapipe model
        landmarkerRef.current = await loadFaceLandmarker();

        setExpression("Camera ready. Click Detect Expression.");
      } catch (error) {
        console.error(error);
        setExpression("Camera / Model Error");
      } finally {
        setIsPreparing(false);
      }
    };

    init();

    // cleanup when component unmounts
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current?.close();
    };
  }, []);

  return (
    <div className="face">
      <h2>{expression}</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="800"
      />

      <button
        onClick={handleDetect}
        disabled={isPreparing || isDetecting || songLoading}
      >
        {isPreparing
          ? "Preparing..."
          : isDetecting || songLoading
          ? "Detecting..."
          : "Detect Expression"}
      </button>
    </div>
  );
};

export default FaceExpression;
