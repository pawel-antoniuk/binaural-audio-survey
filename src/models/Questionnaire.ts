import { ApiResource } from "../types/api";

export default interface Questionnaire extends ApiResource {
  age: string;
  hearingDifficulties: boolean;
  listeningTestParticipation: boolean;
  headphonesMakeAndModel?: string;
  identifier?: string;
}