import classNames from "classnames";

type Props = {
	children: React.ReactNode;
	className?: string;
	left?: boolean;
	onClick: () => void;
};

export const ActionButton = ({
	children,
	className,
	left = false,
	onClick,
}: Props) => (
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
