import React, { useState } from "react";
import { Icon } from "../shared/Icon";
import { camera } from "../icons";
import { dataUriToFile } from "../utils/file";
import { PhotoCarousel } from "./PhotoCarousel";
import { CameraModal } from "./CameraModal";

type Props = {
	allowMultiplePhotos?: boolean;
	fileName?: string;
	onAddPhoto: (file: File) => void;
	onRemovePhoto: (index: number) => void;
};

export const CameraWidget = ({
	allowMultiplePhotos,
	fileName = "photo",
	onAddPhoto,
	onRemovePhoto,
}: Props) => {
	const [cameraOpen, setCameraOpen] = useState(false);
	const [photos, setPhotos] = useState<File[]>([]);
	const cameraInput = React.useRef<HTMLInputElement>(null);

	const handleTakePhoto = (dataUri: string) => {
		const file = dataUriToFile(dataUri, `${fileName}_${Date.now()}.png`);
		onAddPhoto(file);
		setPhotos((prevValue) => [...prevValue, file]);
		setCameraOpen(false);
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
			setCameraOpen(true);
		}
	};

	const hasPhotos = photos.length > 0;

	return (
		<>
			<CameraModal
				onClose={() => setCameraOpen(false)}
				onTakePhoto={handleTakePhoto}
				open={cameraOpen}
			/>

			{hasPhotos ? (
				<PhotoCarousel
					canAddMore={allowMultiplePhotos}
					onAddPhoto={() => setCameraOpen(true)}
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
						icon={camera}
						className="mx-auto h-12 w-12 group-hover:text-[var(--primary)]"
					/>
					<input
						ref={cameraInput}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleMobileTakePhoto}
					/>
					<span className="mt-2 block text-sm font-medium group-hover:text-[var(--primary)]">
						Take a photo
					</span>
				</button>
			)}
		</>
	);
};
