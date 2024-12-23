import Message from '../models/Message';
import { ApiService } from '../services/api.service';
import { createResourceHook } from './useResource';

const messageService = new ApiService<Message>('/messages');
export const useMessages = createResourceHook(messageService);
