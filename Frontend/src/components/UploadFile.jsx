import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import uploadImage from '../assets/upload_image_icon.png';

const FileUpload = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center w-full h-96 p-6 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50"
    >
      <input {...getInputProps()} />
      {/* Ikon dan teks utama */}
      <div className="flex flex-col items-center gap-y-2">
        {/* <div className="p-4 border-2 border-dashed border-gray-400 rounded-md"> */}
        <img
          src={uploadImage}
          alt="Upload Icon"
          className="w-16 h-16"
        />
        {/* </div> */}
        <p className="text-gray-700 font-medium">Drag a CSV file here</p>
        <p className="text-sm text-gray-500">
          Must include FZ, PO4, P4, T8, AF3, and F3 channel
        </p>
      </div>
      {/* Garis pemisah */}
      <div className="flex items-center w-full my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-2 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      {/* Tombol Browse */}
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-400 rounded-full hover:bg-gray-100"
      >
        Browse File
      </button>
    </div>
  );
};

export default FileUpload;
