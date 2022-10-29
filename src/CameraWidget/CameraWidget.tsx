import classNames from "classnames";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import Icon from "../shared/Icon";
import { add, arrowLeft, arrowRight, camera, close, trash } from "../icons";
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
			className,
			"group absolute top-1 p-2 bg-[color:var(--background)] rounded-full shadow-md hover:shadow-lg hover:[color:var(--primary)]",
			{ "left-1": left, "right-1": !left }
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
			<div className="relative h-72 min-w-full min-h-full">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={URL.createObjectURL(photos[activeIndex])}
					alt={photos[activeIndex].name}
					className="m-auto object-cover max-w-full max-h-full"
				/>
				{addMore && (
					<ActionButton onClick={onAddPhoto} left>
						<Icon icon={add} />
					</ActionButton>
				)}
				<ActionButton onClick={handleRemovePhoto}>
					<Icon icon={trash} className="h-6 w-6 group-hover:text-red-500" />
				</ActionButton>
			</div>
			{addMore && (
				<div className="flex items-center justify-center mt-4">
					<button
						className="p-2 mr-2 rounded-full group"
						onClick={() => setActiveIndex((prev) => prev - 1)}
						disabled={activeIndex === 0}
					>
						<Icon
							icon={arrowLeft}
							className="h-6 w-6 group-enabled:group-hover:[color:var(--primary)]"
						/>
					</button>
					<button
						className="p-2 ml-2 rounded-full group"
						onClick={() => setActiveIndex((prev) => prev + 1)}
						disabled={activeIndex === photos.length - 1}
					>
						<Icon
							icon={arrowRight}
							className="h-6 w-6 group-enabled:group-hover:[color:var(--primary)]"
						/>
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
						<div className="absolute left-0 top-0 bg-gray-400 opacity-60 w-full h-full" />
						<div className="bg-[color:var(--background)] rounded-lg md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
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
								<Icon icon={close} />
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

export default CameraWidget;
