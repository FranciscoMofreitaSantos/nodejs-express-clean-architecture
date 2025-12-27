import config from "../../config";
import { HttpClient } from "./HttpClient";

if (!config.anotherApiYouMightHaveURL) {
    throw new Error("❌ Missing upstream API URLs");
}

export const anotherApi = new HttpClient(config.anotherApiYouMightHaveURL);
