import { ApiResource } from "../types/api";

export default interface Message extends ApiResource {
  userId: string;
  content: string;
};
