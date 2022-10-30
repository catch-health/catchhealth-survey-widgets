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
					onClick={() => setCameraOpen(true)}
				>
					<Icon
						icon={camera}
						className="mx-auto h-12 w-12 group-hover:text-[var(--primary)]"
					/>
					<span className="mt-2 block text-sm font-medium group-hover:text-[var(--primary)]">
						Take a photo
					</span>
				</button>
			)}
		</>
	);
};
