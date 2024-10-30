import path from "path";

const rootPath = path.resolve(__dirname, '..', '..');
const SALT_WARK_FACTOR = 10;
const config = { rootPath, uploadPath: path.join(rootPath, 'public/uploads'), SALT_WARK_FACTOR };

export default config;