import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  keyFilename: "./cloud-vision.json",
});

// Add this new function for document text detection
export async function recognizeDocumentText(imagePath: string) {
  try {
    const [result] = await client.documentTextDetection(imagePath);
    const detections = result.fullTextAnnotation;

    if (!detections) {
      throw new Error("No text detected in the image");
    }

    return {
      text: detections.text,
    };
  } catch (error) {
    console.error("Error in text recognition:", error);
    throw error;
  }
}