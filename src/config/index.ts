import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    port: process.env.PORT,
    upload_dir: process.env.UPLOAD_DIR,
    max_file_size: process.env.MAX_FILE_SIZE as string,
    openRouterApiKey: process.env.OPENROUTER_API_KEY as string
}