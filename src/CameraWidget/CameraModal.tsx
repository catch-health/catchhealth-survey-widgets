import { createPortal } from "react-dom";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import { close } from "../icons";
import { Icon } from "../shared/Icon";
import { ActionButton } from "./ActionButton";

type Props = {
	onClose: () => void;
	onTakePhoto: (dataUri: string) => void;
	open: boolean;
};

export const CameraModal = ({ onClose, onTakePhoto, open }: Props) => {
	if (!open) return null;

	return createPortal(
		<div className="absolute top-0 px-4 w-full min-h-screen md:flex md:items-center md:justify-center z-50">
			<div className="absolute left-0 top-0 bg-gray-400 opacity-60 w-full h-full" />
			<div className="bg-[color:var(--background)] rounded-lg md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
				<Camera
					onTakePhoto={onTakePhoto}
					isImageMirror={true}
					isMaxResolution={false}
					isDisplayStartCameraError={false}
					isFullscreen={false}
					sizeFactor={1}
					idealFacingMode={FACING_MODES.USER}
				/>
				<ActionButton className="top-5 right-5" onClick={onClose}>
					<Icon icon={close} />
				</ActionButton>
			</div>
		</div>,
		document.body
	);
};
