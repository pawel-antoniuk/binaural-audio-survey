import Comment from '../models/Comment';
import { ApiService } from '../services/api.service';
import { createResourceHook } from './useResource';

const commentService = new ApiService<Comment>('/comments');
export const useComments = createResourceHook(commentService);
