import { useState } from "react";
import { add, arrowLeft, arrowRight, trash } from "../icons";
import { Icon } from "../shared/Icon";
import { ActionButton } from "./ActionButton";

type Props = {
	canAddMore?: boolean;
	onAddPhoto: () => void;
	onRemovePhoto: (index: number) => void;
	photos: File[];
};

export const PhotoCarousel = ({
	canAddMore: addMore,
	onAddPhoto,
	onRemovePhoto,
	photos,
}: Props) => {
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
