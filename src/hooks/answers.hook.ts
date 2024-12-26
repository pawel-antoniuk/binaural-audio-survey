import { Answer } from '../models/Answer';
import { ApiService } from '../services/api.service';
import { createResourceHook } from './useResource';

export const useAnswers = createResourceHook(new ApiService<Answer>('/answers'));
