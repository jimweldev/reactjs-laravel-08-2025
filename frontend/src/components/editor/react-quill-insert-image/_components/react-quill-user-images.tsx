import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { FaEllipsisVertical, FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { toast } from 'sonner';
import type { UserImage } from '@/04_types/user-image';
import useUserImageStore from '@/05_stores/user-image-store';
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
  // Access store values
  const { setIsOpenUploadUserImageDialog } = useUserImageStore();

  const userImagesPagination = useTanstackQueryPaginate<UserImage>(
    {
      endpoint: '/user-images',
      defaultSort: '-is_pinned,file_name',
    },
    {
      enabled: open,
    },
  );

  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null);
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

  const actions = (
    <Button size="sm" onClick={() => setIsOpenUploadUserImageDialog(true)}>
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
              <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-2">
                {userImagesPagination.data?.records?.map(image => (
                  <div
                    className={cn(
                      'bg-muted relative col-span-2 space-y-1 rounded-lg border-2 p-1',
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
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon-xs">
                            <FaEllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <FaPenToSquare />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">
                            <FaTrash />
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

      <UploadUserImage refetch={userImagesPagination.refetch} />
    </>
  );
};

export default ReactQuillUserImages;
