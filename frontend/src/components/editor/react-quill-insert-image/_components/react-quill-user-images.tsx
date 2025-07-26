import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { toast } from 'sonner';
import type { UserImage } from '@/04_types/user-image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useTanstackQueryPaginate from '@/hooks/tanstack/use-tanstack-query-paginate';

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
  const { data: userImages } = useTanstackQueryPaginate<UserImage>(
    {
      endpoint: '/user-images',
      defaultSort: 'file_name',
    },
    {
      enabled: open,
    },
  );

  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null);
  const onSubmit = (image?: UserImage) => {
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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="@container/dialog" size="lg">
          <DialogHeader>
            <DialogTitle>My Images</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <pre>{JSON.stringify(userImages, null, 2)}</pre>
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit(selectedImage!)}>Select</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReactQuillUserImages;
