import classNames from "classnames";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { AddIcon, CameraIcon, CloseIcon, TrashIcon } from "../icons";
import { dataUriToFile } from "../utils/file";

type Props = {
  allowMultiplePhotos?: boolean;
  fileName?: string;
  onAddPhoto: (file: File) => void;
  onRemovePhoto: (index: number) => void;
};

const ActionButton = ({
  className,
  children,
  onClick,
  left = false,
}: {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
  left?: boolean;
}) => (
  <button
    className={classNames(
      "absolute top-1 p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-100",
      { "left-1": left, "right-1": !left },
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const PhotoCarousel = ({
  addMore,
  photos,
  onRemovePhoto,
  onAddPhoto,
}: {
  photos: File[];
  onRemovePhoto: (index: number) => void;
  onAddPhoto: () => void;
  addMore?: boolean;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRemovePhoto = () => {
    onRemovePhoto(activeIndex);
    setActiveIndex(0);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-64 min-w-full min-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={URL.createObjectURL(photos[activeIndex])}
          alt={photos[activeIndex].name}
          className="m-auto object-cover max-w-full max-h-full"
        />
        {addMore && (
          <ActionButton onClick={onAddPhoto} left>
            <AddIcon className="w-6 h-6" />
          </ActionButton>
        )}
        <ActionButton onClick={handleRemovePhoto}>
          <TrashIcon className="h-6 w-6" />
        </ActionButton>
      </div>
      {addMore && (
        <div className="flex items-center justify-center mt-4">
          <button
            className="p-2 mr-2 text-gray-500 rounded-full hover:bg-gray-100 disabled:text-gray-300"
            onClick={() => setActiveIndex((prev) => prev - 1)}
            disabled={activeIndex === 0}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="p-2 ml-2 text-gray-500 rounded-full hover:bg-gray-100 disabled:text-gray-300"
            onClick={() => setActiveIndex((prev) => prev + 1)}
            disabled={activeIndex === photos.length - 1}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const CameraWidget = ({
  allowMultiplePhotos,
  fileName = "photo",
  onAddPhoto,
  onRemovePhoto,
}: Props) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const handleTakePhoto = (dataUri: string) => {
    const file = dataUriToFile(dataUri, `${fileName}_${Date.now()}.png`);
    onAddPhoto(file);
    setPhotos((prevValue) => [...prevValue, file]);
    setCameraOpen(false);
  };

  const handleRemovePhoto = (index: number) => {
    onRemovePhoto(index);
    setPhotos((prevValue) => prevValue.filter((_, i) => i !== index));
  };

  return (
    <>
      {cameraOpen &&
        createPortal(
          <div className="absolute top-0 px-4 w-full min-h-screen md:flex md:items-center md:justify-center z-50">
            <div className="absolute top-0 bg-gray-400 opacity-60 w-full h-full" />
            <div className="bg-white rounded-lg md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
              <Camera
                onTakePhoto={handleTakePhoto}
                isImageMirror={false}
                isMaxResolution={false}
                isDisplayStartCameraError={false}
                isFullscreen={false}
                sizeFactor={1}
                idealFacingMode={FACING_MODES.USER}
              />
              <ActionButton
                className="top-5 right-5"
                onClick={() => setCameraOpen(false)}
              >
                <CloseIcon className="w-6 h-6" />
              </ActionButton>
            </div>
          </div>,
          document.body
        )}

      {photos.length ? (
        <PhotoCarousel
          photos={photos}
          onRemovePhoto={handleRemovePhoto}
          onAddPhoto={() => setCameraOpen(true)}
          addMore={allowMultiplePhotos}
        />
      ) : (
        <button
          type="button"
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => setCameraOpen(true)}
        >
          <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Take a photo
          </span>
        </button>
      )}
    </>
  );
};

export default CameraWidget;
