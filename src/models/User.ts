import { ApiResource } from "../types/api";
import Questionnaire from "./Questionnaire";

export interface User extends ApiResource {
  id: string;
  questionnaire: Questionnaire;
  metadata: any;
}
