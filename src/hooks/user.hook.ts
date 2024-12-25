import { User } from '../models/User';
import { ApiService } from '../services/api.service';
import { createResourceHook } from './useResource';

const userService = new ApiService<User>('/users');
export const useUser = createResourceHook(userService);
