import { create } from 'zustand';
import type { UserImage } from '@/04_types/user-image';

// Define the store
type UserImageStoreProps = {
  selectedUserImage: UserImage | null;
  isOpenInsertImageDialog: boolean;
  isOpenUploadUserImageDialog: boolean;
  isOpenUpdateUserImageDialog: boolean;
  isOpenDeleteUserImageDialog: boolean;
  setSelectedUserImage: (userImage: UserImage | null) => void;
  setIsOpenInsertImageDialog: (isOpen: boolean) => void;
  setIsOpenUploadUserImageDialog: (isOpen: boolean) => void;
  setIsOpenUpdateUserImageDialog: (isOpen: boolean) => void;
  setIsOpenDeleteUserImageDialog: (isOpen: boolean) => void;
  reset: () => void;
};

// Initial state
const initialState = {
  selectedUserImage: null,
  isOpenInsertImageDialog: false,
  isOpenUpdateUserImageDialog: false,
  isOpenDeleteUserImageDialog: false,
  isOpenUploadUserImageDialog: false,
};

// Create the store
const useUserImageStore = create<UserImageStoreProps>(set => ({
  selectedUserImage: null,
  selection: null,
  isOpenInsertImageDialog: false,
  isOpenUploadUserImageDialog: false,
  isOpenUpdateUserImageDialog: false,
  isOpenDeleteUserImageDialog: false,
  setSelectedUserImage: userImage => set({ selectedUserImage: userImage }),
  setIsOpenInsertImageDialog: isOpen =>
    set({ isOpenInsertImageDialog: isOpen }),
  setIsOpenUploadUserImageDialog: isOpen =>
    set({ isOpenUploadUserImageDialog: isOpen }),
  setIsOpenUpdateUserImageDialog: isOpen =>
    set({ isOpenUpdateUserImageDialog: isOpen }),
  setIsOpenDeleteUserImageDialog: isOpen =>
    set({ isOpenDeleteUserImageDialog: isOpen }),
  reset: () => set(initialState),
}));

export default useUserImageStore;
