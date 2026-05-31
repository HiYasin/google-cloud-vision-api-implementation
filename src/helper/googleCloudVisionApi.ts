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

export async function detectText(filePath:string) {
  try {
    const [result] = await client.textDetection(filePath);

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      console.log("❌ No QR/Text found");
      return;
    }

    console.log("✅ Extracted Data:");
    console.log(detections[0].description); // main text content

  } catch (error) {
    console.error(error);
  }
}