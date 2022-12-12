import { camera, close, document } from "../icons";
import { Icon } from "../shared/Icon";

type Props = {
  onClose: () => void;
  onChooseCamera: () => void;
  onChooseFile: () => void;
};

export const ChooseCameraOrFileModal = ({
  onClose,
  onChooseCamera,
  onChooseFile,
}: Props) => {
  return (
    <>
      <div className="z-10 absolute left-0 top-0 bg-gray-400 opacity-60 w-full h-full" />
      <div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md bg-[color:var(--background)]">
        <button
          type="button"
          className="absolute top-0 right-0 p-2"
          onClick={onClose}
        >
          <Icon icon={close} />
        </button>
        <div className="flex flex-row items-center gap-10">
          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              className="flex items-center justify-center w-24 h-24 rounded-full bg-[color:var(--primary)] text-white mt-4"
              onClick={onChooseCamera}
            >
              <Icon icon={camera} className="h-8 w-8" />
            </button>
            <span className="text-sm">Take a photo</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              className="flex items-center justify-center w-24 h-24 rounded-full bg-[color:var(--primary)] text-white mt-4"
              onClick={onChooseFile}
            >
              <Icon icon={document} className="h-8 w-8" />
            </button>
            <span className="text-sm">Choose a file</span>
          </div>
        </div>
      </div>
    </>
  );
};
