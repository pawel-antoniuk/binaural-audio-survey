import { ApiResource } from "../types/api";

export default interface Comment extends ApiResource {
  userId: string;
  questionId: string | null,
  message: string;
};
