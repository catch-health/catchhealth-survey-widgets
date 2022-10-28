import ReactDOM from "react-dom/client";
import { Serializer, CustomWidgetCollection, SvgRegistry } from "survey-core";
import CameraWidgetWrapper from "./CameraWidgetWrapper";
import type { IQuestion } from "survey-core";

// Register Icon for the camera widget
SvgRegistry.registerIconFromSvg(
	"camera",
	'<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Camera</title><path d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M124 158v-22h-24v22"/></svg>',
	""
);

export interface CameraQuestion extends IQuestion {
	allowMultiplePhotos: boolean;
}

export function registerCameraWidget(
	handleUpload?: (file: File) => Promise<string>
) {
	const cameraWidget = {
		name: "camera",
		title: "Camera",
		iconName: "camera",
		init: () => {
			// Add default configuration for new type
			Serializer.addClass(
				"camera",
				[
					{
						name: "allowMultiplePhotos:boolean",
						default: false,
						category: "general",
						visibleIndex: 5,
					},
				],
				undefined,
				"empty"
			);

			// Hide the read only checkbox
			const readOnly = Serializer.findProperty("camera", "readOnly");
			readOnly.visible = false;
		},
		widgetIsLoaded: () => true,
		isFit: (question: IQuestion) => question.getType() === "camera",
		isDefaultRender: false,
		html: "<div />",
		afterRender: (question: CameraQuestion, el: HTMLElement) => {
			// For some reason this function is being executed twice
			if (el.className) return;

			el.className = "rendered";

			// Let's make it a React component
			const root = ReactDOM.createRoot(el);
			root.render(
				<CameraWidgetWrapper question={question} handleUpload={handleUpload} />
			);
		},
	};
	// Register our widget in singleton custom widget collection
	CustomWidgetCollection.Instance.addCustomWidget(cameraWidget, "customtype");
}

export function disableFileDataAsText() {
	const storeDataAsText = Serializer.findProperty("file", "storeDataAsText");
	storeDataAsText.defaultValue = false;
	storeDataAsText.visible = false;
}
