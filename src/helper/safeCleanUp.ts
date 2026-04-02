import * as fs from "fs";
export const  safeFileCleanup = async (filePath: string) => {
  try {
    await fs.promises.access(filePath);
    await fs.promises.unlink(filePath);
    console.log(`Successfully cleaned up file: ${filePath}`);
  } catch (error) {

    if ((error as any).code === "EPERM") {
      console.warn(`File is locked, will be cleaned up later: ${filePath}`);
      // Schedule cleanup for later
      setTimeout(async () => {
        try {
          await fs.promises.unlink(filePath);
          console.log(`Delayed cleanup successful: ${filePath}`);
        } catch (err) {
          console.error(`Failed delayed cleanup: ${filePath}`, err);
        }
      }, 1000); // Try again after 1 second
    } else {
      console.warn(`Failed to cleanup file: ${filePath}`, error);
    }
  }
}