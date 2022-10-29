import type { ReactNode } from "react";

type Props = {
	className?: string;
	icon: ReactNode;
};

const Icon = ({ className, icon }: Props) => {
	return <div className={className ?? "h-6 w-6"}>{icon}</div>;
};

export default Icon;
