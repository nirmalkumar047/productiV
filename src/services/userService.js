import { getUserDocument } from '../firebase/firestore';
import { updateUserProfileData } from '../firebase/auth';

export const userService = {
  getProfile: async (userId) => {
    return await getUserDocument(userId);
  },

  updateProfile: async (userId, updates) => {
    return await updateUserProfileData(userId, updates);
  },
};
export default userService;
