import { useEffect, useRef, useState } from "react";
import { SurveyModel } from "survey-core";
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
	const [uploading, setUploading] = useState(false);
	const [isQuestionRendered, setIsQuestionRendered] = useState(true);
	const hasUploadedPhotos = useRef(false);
	const handleAddPhoto = async (file: File) => {
		const content = await fileToBase64(file);

		const photo = {
			name: file.name,
			type: file.type,
		};

		if (question.value) {
			question.value.push(photo);
			question.contents?.push(content);
		} else {
			question.value = [photo];
			question.contents = [content];
		}
	};

	const handleRemovePhoto = (index: number) => {
		question.value?.splice(index, 1);
		question.contents?.splice(index, 1);

		if (!question.value?.length) {
			question.value = null;
		}
	};

	const survey = question.survey as SurveyModel;

	const uploadPhotos = async () => {
		setUploading(true);
		if (question.value) {
			for (let i = 0; i < question.value.length; i++) {
				const photo = question.value[i];
				const content = question.contents?.[i];
				if (photo.fileId || !content) {
					continue;
				}

				const file = dataUriToFile(content, photo.name);
				photo.fileId = await handleUpload?.(file);
			}
		}

		setUploading(false);
		hasUploadedPhotos.current = true;

		// Submit question
		survey.setValue(question.name, question.value);

		// Go to next page
		if (survey.isLastPage) {
			survey.doComplete();
		} else {
			survey.nextPage();
		}
	};

	useEffect(() => {
		const handleAfterRenderQuestion = (sender: any, options: any) => {
			if (options.question === question) {
				setIsQuestionRendered(true);
			} else {
				setIsQuestionRendered(false);
			}
		};

		survey.onAfterRenderQuestion.add(handleAfterRenderQuestion);

		return () => {
			survey.onAfterRenderQuestion.remove(handleAfterRenderQuestion);
		};
	}, []);

	useEffect(() => {
		if (!isQuestionRendered) {
			return;
		}

		const handleCompleting = (sender: any, options: any) => {
			if (hasUploadedPhotos.current) {
				return;
			}

			if (question.value) {
				uploadPhotos();
				options.allowComplete = false;
			}
		};

		const handleCurrentPageChanging = (sender: any, options: any) => {
			if (hasUploadedPhotos.current) {
				return;
			}

			if (options.isNextPage && question.value) {
				uploadPhotos();
				options.allowChanging = false;
			}
		};

		const handleValueChanged = () => {
			hasUploadedPhotos.current = false;
		};

		survey.onCompleting.add(handleCompleting);
		survey.onCurrentPageChanging.add(handleCurrentPageChanging);
		survey.onValueChanged.add(handleValueChanged);

		return () => {
			survey.onCompleting.remove(handleCompleting);
			survey.onCurrentPageChanging.remove(handleCurrentPageChanging);
			survey.onValueChanged.remove(handleValueChanged);
		};
	}, [isQuestionRendered]);

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
			initialValue={question.value?.map((photo, i) => {
				const content = question.contents?.[i] || "";

				return dataUriToFile(content, photo.name);
			})}
			onAddPhoto={handleAddPhoto}
			onRemovePhoto={handleRemovePhoto}
			fileName={question.name}
			onUploadPhotos={uploadPhotos}
			uploading={uploading}
		/>
	);
};
