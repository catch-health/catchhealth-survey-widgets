import { useState } from "react";
import { fileToBase64 } from "../utils/file";
import CameraWidget from "./CameraWidget";
import type { CameraQuestion } from "./index";

type Props = {
	question: CameraQuestion;
	handleUpload?: (file: File) => Promise<string>;
};

const CameraWidgetWrapper = ({ question, handleUpload }: Props) => {
	const [allowMultiplePhotos, setAllowMultiplePhotos] = useState(
		question.allowMultiplePhotos
	);
	const handleAddPhoto = async (file: File) => {
		const isFileId = !!handleUpload;
		let fileToContent = handleUpload ?? fileToBase64;
		const content = await fileToContent(file);

		const photo = {
			name: file.name,
			type: file.type,
			fileId: isFileId ? content : undefined,
			content: isFileId ? undefined : content,
		};

		if (question.value) {
			question.value.push(photo);
		} else {
			question.value = [photo];
		}
	};

	const handleRemovePhoto = (index: number) => {
		question.value.splice(index, 1);

		if (!question.value.length) {
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
			onAddPhoto={handleAddPhoto}
			onRemovePhoto={handleRemovePhoto}
			fileName={question.name}
		/>
	);
};

export default CameraWidgetWrapper;
