import React, { useState } from 'react'
import { Alert, Dialog, Snackbar, TextField } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { DropzoneArea } from "mui-file-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/serverless/config';
import { addDoc, collection } from 'firebase/firestore';

type Props = {
  onClose: any;
  open: any;
  setOpen: any;
}

export default function GalleryDialog({ onClose, open, setOpen }: Props) {
  const [imageDimensionError, setImageDimensionError] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null as any);
  const [dropzoneKey, setDropzoneKey] = useState(1);
  const [imageName, setImageName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState<string | null>();

  const uploadImage = async () => {
    const storageRef = ref(storage, `gallery/${imageName + '-' + getRandomKey()}.jpeg`);
    await uploadBytes(storageRef, image, {
      contentType: "image/jpeg",
    });
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  const handleSnackbarClose = () => {
    setImageUploadSuccess(null);
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const imageLink = await uploadImage();
    const galleryImage = {
      image: imageLink
    }
    const galleryRef = collection(db, "gallery");

    await addDoc(galleryRef, galleryImage);
    setImageUploadSuccess(`SUCCESS: Image ${imageName} Uploaded Successfully.`)
    setLoading(false);
    setImageName('');
  }

  const handleChange = (event: File[]) => {
    const img = document.createElement("img");

    if (event && "length" in event && event[length]) {
      img.onload = (ev: any) => {
          setImageDimensionError(false);
          setImage(event[0]);
      };

      img.src = URL.createObjectURL(event[0]);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth='md'
      sx={{ padding: "0", margin: "0", backdropFilter: "blur(5px)" }}
      PaperProps={{ sx: { borderRadius: "10px" } }}
    >
      <div className='p-4'>
        <form className="" onSubmit={handleSubmit}>
          <div className="flex justify-between font-bold text-2xl pl-2 pr-2 pt-2 border-b-[1px] border-rose-300">
            <h1 className="w-[95%] uppercase"> Upload to Gallery </h1>
            <div
              className="flex justify-center items-center rounded-lg hover:bg-orange-200/100 w-[30px] h-[30px] hover:cursor-pointer"
              onClick={onClose}
            >
              <CloseIcon sx={{ color: "#FF5E0E" }} />
            </div>
          </div>

          <div className='p-2'>
            <TextField
              label='image name'
              variant='outlined'
              fullWidth
              value={imageName}
              onChange={(e: any) => setImageName(e.target.value)}
              required
            />
          </div>

          <div className="p-2">
            <DropzoneArea
              acceptedFiles={["image/jpeg"]}
              dropzoneText={"Attach Event Poster"}
              filesLimit={1}
              Icon={CloudUploadIcon}
              maxFileSize={5242880}
              clearOnUnmount
              key={1}
              fileObjects={undefined}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-row-reverse'>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 my-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              {loading ? "Uploading..." : `Upload `}
              {!loading && <CloudUploadIcon />}
            </button>
          </div>
        </form>
      </div >
      <Snackbar
        open={imageUploadSuccess ? true : false}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {imageUploadSuccess}
        </Alert>
      </Snackbar>
    </Dialog >
  )
}

const getRandomKey = () => {
  return Math.random().toString(36).slice(2)
}