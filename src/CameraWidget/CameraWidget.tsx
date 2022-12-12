import React, { useState } from "react";
import { Icon } from "../shared/Icon";
import { camera, image, images } from "../icons";
import { dataUriToFile } from "../utils/file";
import { PhotoCarousel } from "./PhotoCarousel";
import { CameraModal } from "./CameraModal";
import { UploadingFileModal } from "./UploadingFileModal";
import { ChooseCameraOrFileModal } from "./ChooseCameraOrFileModal";

type Props = {
	allowMultiplePhotos?: boolean;
	fileName?: string;
	initialValue?: File[];
	onAddPhoto: (file: File) => Promise<void>;
	onRemovePhoto: (index: number) => void;
	uploading?: boolean;
};

export const CameraWidget = ({
	allowMultiplePhotos,
	fileName = "photo",
	initialValue = [],
	onAddPhoto,
	onRemovePhoto,
	uploading,
}: Props) => {
	const [cameraOpen, setCameraOpen] = useState(false);
	const [modeSelectionOpen, setModeSelectionOpen] = useState(false);
	const [photos, setPhotos] = useState<File[]>(initialValue);
	const cameraInput = React.useRef<HTMLInputElement>(null);

	const handleTakePhoto = async (dataUri: string) => {
		const file = dataUriToFile(dataUri, `${fileName}_${Date.now()}.png`);

		setCameraOpen(false);
		await onAddPhoto(file);
		setPhotos((prevValue) => [...prevValue, file]);
	};

	const handleMobileTakePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			onAddPhoto(file);
			setPhotos((prevValue) => [...prevValue, file]);
		}
	};

	const handleRemovePhoto = (index: number) => {
		onRemovePhoto(index);
		setPhotos((prevValue) => prevValue.filter((_, i) => i !== index));
	};

	const handleOpenCamera = () => {
		if (/Android|iPhone/i.test(navigator.userAgent)) {
			cameraInput.current?.click();
		} else {
			setModeSelectionOpen(true);
		}
	};

	const hasPhotos = photos.length > 0;

	return (
		<div className="relative">
			<CameraModal
				onClose={() => setCameraOpen(false)}
				onTakePhoto={handleTakePhoto}
				open={cameraOpen}
			/>

			{modeSelectionOpen && (
				<ChooseCameraOrFileModal
					onClose={() => setModeSelectionOpen(false)}
					onChooseCamera={() => {
						setCameraOpen(true);
						setModeSelectionOpen(false);
					}}
					onChooseFile={() => {
						cameraInput.current?.click();
						setModeSelectionOpen(false);
					}}
				/>
			)}

			{uploading && <UploadingFileModal />}

			{hasPhotos ? (
				<PhotoCarousel
					canAddMore={allowMultiplePhotos}
					onAddPhoto={() => setModeSelectionOpen(true)}
					onRemovePhoto={handleRemovePhoto}
					photos={photos}
				/>
			) : (
				<button
					type="button"
					className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-[color:var(--primary)] group"
					onClick={handleOpenCamera}
				>
					<Icon
						icon={allowMultiplePhotos ? images : image}
						className="mx-auto h-12 w-12 group-hover:text-[var(--primary)]"
					/>
					<input
						ref={cameraInput}
						type="file"
						accept="image/*"
						className="hidden"
						multiple={allowMultiplePhotos}
						onChange={handleMobileTakePhoto}
					/>
					<span className="mt-2 block text-sm font-medium group-hover:text-[var(--primary)]">
						{allowMultiplePhotos ? "Add photos" : "Add a photo"}
					</span>
				</button>
			)}
		</div>
	);
};
