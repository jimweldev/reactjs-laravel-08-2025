import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import {
  FaEllipsisVertical,
  FaPenToSquare,
  FaStar,
  FaThumbtack,
  FaTrash,
} from 'react-icons/fa6';
import { toast } from 'sonner';
import type { UserImage } from '@/04_types/user-image';
import { mainInstance } from '@/07_instances/main-instance';
import DataTable from '@/components/data-table/data-table';
import ReactImage from '@/components/image/react-image';
import UserImagesSkeleton from '@/components/skeleton/user-images-skeleton';
import Tooltip from '@/components/tooltip/tooltip';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTanstackQueryPaginate from '@/hooks/tanstack/use-tanstack-query-paginate';
import { cn } from '@/lib/utils';
import DeleteUserImage from './_components/delete-user-image';
import RenameUserImage from './_components/rename-user-image';
import UploadUserImage from './_components/upload-user-image';

type ReactQuillEditorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectImage: (url: string) => void;
};

const ReactQuillUserImages = ({
  open,
  setOpen,
  onSelectImage: onSelectImageHandler,
}: ReactQuillEditorProps) => {
  const userImagesPagination = useTanstackQueryPaginate<UserImage>(
    {
      endpoint: '/user-images',
      defaultSort: '-is_pinned,file_name',
      defaultLimit: '24',
    },
    {
      enabled: open,
    },
  );

  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null);
  const [openUploadUserImage, setOpenUploadUserImage] =
    useState<boolean>(false);
  const [openRenameUserImage, setOpenRenameUserImage] =
    useState<boolean>(false);
  const [openDeleteUserImage, setOpenDeleteUserImage] =
    useState<boolean>(false);

  const onSubmit = (image: UserImage) => {
    const finalImage = image || selectedImage;
    if (!finalImage) {
      toast.error('Please select an image');
      return;
    }

    onSelectImageHandler(
      `${import.meta.env.VITE_STORAGE_BASE_URL}/${finalImage.file_path}`,
    );
    setSelectedImage(null);
    setOpen(false);
  };

  const onTogglePin = (image: UserImage) => {
    toast.promise(
      mainInstance.patch(`/user-images/${image?.id}`, {
        is_pinned: !image.is_pinned,
      }),
      {
        loading: 'Loading...',
        success: () => {
          userImagesPagination.refetch();
          return 'Success!';
        },
        error: error => {
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
      },
    );
  };

  const actions = (
    <Button size="sm" onClick={() => setOpenUploadUserImage(true)}>
      Create
    </Button>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="5xl">
          <DialogHeader>
            <DialogTitle>My Images</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DataTable
              actions={actions}
              defaultView="grid"
              pagination={userImagesPagination}
              skeleton={<UserImagesSkeleton inputCount={24} />}
            >
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
                {userImagesPagination.data?.records?.map(image => (
                  <div
                    className={cn(
                      'bg-muted relative space-y-1 rounded-lg border-2 p-1',
                      selectedImage?.id === image.id
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted',
                    )}
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    onDoubleClick={() => {
                      setSelectedImage(image);
                      onSubmit(image);
                    }}
                  >
                    <div className="flex items-center justify-between gap-1 px-1">
                      <Tooltip content={image.file_name!}>
                        <p className="truncate text-xs">{image.file_name}</p>
                      </Tooltip>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <FaEllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => setOpenRenameUserImage(true)}
                          >
                            <FaPenToSquare className="size-3.5" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onTogglePin(image)}>
                            <FaThumbtack className="size-3.5" />
                            {image.is_pinned ? 'Unpin' : 'Pin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setOpenDeleteUserImage(true)}
                          >
                            <FaTrash className="size-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md">
                      <ReactImage
                        className="min-h-full min-w-full object-cover"
                        src={`${import.meta.env.VITE_STORAGE_BASE_URL}/${image.file_path}`}
                        alt={image.file_name}
                      />
                      {image.is_pinned ? (
                        <FaStar className="text-warning absolute right-1 bottom-1 drop-shadow" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </DataTable>
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit(selectedImage!)}>Select</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UploadUserImage
        open={openUploadUserImage}
        setOpen={setOpenUploadUserImage}
        refetch={userImagesPagination.refetch}
      />
      <RenameUserImage
        open={openRenameUserImage}
        setOpen={setOpenRenameUserImage}
        selectedItem={selectedImage!}
        refetch={userImagesPagination.refetch}
      />
      <DeleteUserImage
        open={openDeleteUserImage}
        setOpen={setOpenDeleteUserImage}
        selectedItem={selectedImage!}
        refetch={userImagesPagination.refetch}
      />
    </>
  );
};

export default ReactQuillUserImages;
