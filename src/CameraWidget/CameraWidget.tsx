import React, { useState } from "react";
import { Icon } from "../shared/Icon";
import { camera } from "../icons";
import { dataUriToFile } from "../utils/file";
import { PhotoCarousel } from "./PhotoCarousel";
import { CameraModal } from "./CameraModal";

type Props = {
	allowMultiplePhotos?: boolean;
	fileName?: string;
	initialValue?: File[];
	onAddPhoto: (file: File) => Promise<void>;
	onRemovePhoto: (index: number) => void;
};

export const CameraWidget = ({
	allowMultiplePhotos,
	fileName = "photo",
	initialValue = [],
	onAddPhoto,
	onRemovePhoto,
}: Props) => {
	const [cameraOpen, setCameraOpen] = useState(false);
	const [photos, setPhotos] = useState<File[]>(initialValue);
	const [uploading, setUploading] = useState(false);
	const cameraInput = React.useRef<HTMLInputElement>(null);

	const handleTakePhoto = async (dataUri: string) => {
		const file = dataUriToFile(dataUri, `${fileName}_${Date.now()}.png`);

		setCameraOpen(false);
		setUploading(true);
		await onAddPhoto(file);
		setUploading(false);
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
			setCameraOpen(true);
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

			{uploading && (
				<>
					<div className="z-10 absolute left-0 top-0 bg-gray-400 opacity-60 w-full h-full" />
					<div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md bg-[color:var(--background)] transition ease-in-out duration-150 cursor-not-allowed">
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Uploading...
					</div>
				</>
			)}

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
		</div>
	);
};
