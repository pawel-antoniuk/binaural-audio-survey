import { ApiResource } from "../types/api";

export default interface Question extends ApiResource {
    id: string;
    audioFilename: string;
}
