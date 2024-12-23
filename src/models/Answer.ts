import { ApiResource } from "../types/api";

export interface Answer extends ApiResource {
  userId: string;
  questionId: string;
  audioFilename: string;
  leftAngle: number;
  rightAngle: number;
  ensembleWidth: number;
}
