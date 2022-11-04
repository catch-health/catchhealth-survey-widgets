import { useState } from "react";
import { dataUriToFile, fileToBase64 } from "../utils/file";
import { CameraWidget } from "./CameraWidget";
import type { CameraQuestion } from "./index";

type Props = {
	question: CameraQuestion;
	handleUpload?: (file: File) => Promise<string>;
};

export const CameraWidgetWrapper = ({ question, handleUpload }: Props) => {
	const [allowMultiplePhotos, setAllowMultiplePhotos] = useState(
		question.allowMultiplePhotos
	);
	const handleAddPhoto = async (file: File) => {
		const fileId = await handleUpload?.(file);
		const content = await fileToBase64(file);

		const photo = {
			name: file.name,
			type: file.type,
			fileId,
			content,
		};

		if (question.value) {
			question.value.push(photo);
		} else {
			question.value = [photo];
		}
	};

	const handleRemovePhoto = (index: number) => {
		question.value?.splice(index, 1);

		if (!question.value?.length) {
			question.value = null;
		}
	};

	question.registerFunctionOnPropertyValueChanged(
		"allowMultiplePhotos",
		() => {
			setAllowMultiplePhotos(question.allowMultiplePhotos);
		},
		""
	);

	return (
		<CameraWidget
			allowMultiplePhotos={allowMultiplePhotos}
			initialValue={question.value?.map((photo) =>
				dataUriToFile(photo.content, photo.name)
			)}
			onAddPhoto={handleAddPhoto}
			onRemovePhoto={handleRemovePhoto}
			fileName={question.name}
		/>
	);
};
