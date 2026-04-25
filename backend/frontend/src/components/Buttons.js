import BaseButton from "./BaseButton.js";

export const PrimaryBackgroundButton = ({
	id = "primary-background-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "white",
	size = "",
	width = "200px",
	title = "Button",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="contained"
		color="primary"
	/>
);

export const PrimaryBorderButton = ({
	id = "primary-border-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "primary",
	size = "",
	width = "200px",
	title = "Button",
	backgroundColor = "white",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="outlined"
		color="primary"
		backgroundColor={backgroundColor}
		borderColor={titleColor}
	/>
);

export const SecondaryBackgroundButton = ({
	id = "secondary-background-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "white",
	size = "",
	width = "200px",
	title = "Button",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="contained"
		color="secondary"
	/>
);

export const SecondaryBorderButton = ({
	id = "secondary-border-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "secondary",
	size = "",
	width = "200px",
	title = "Button",
	backgroundColor = "white",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="outlined"
		color="secondary"
		backgroundColor={backgroundColor}
	/>
);

export const HighlightBackgroundButton = ({
	id = "highlight-background-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "white",
	size = "",
	width = "200px",
	title = "Button",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="contained"
		color="third"
	/>
);

export const HighlightBorderButton = ({
	id = "highlight-border-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "third",
	size = "",
	width = "200px",
	title = "Button",
	backgroundColor = "white",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="outlined"
		color="third"
		backgroundColor={backgroundColor}
	/>
);

export const SuccessBackgroundButton = ({
	id = "success-background-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "white",
	size = "",
	width = "200px",
	title = "Button",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="contained"
		color="success"
	/>
);

export const ErrorBackgroundButton = ({
	id = "error-background-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "white",
	size = "",
	width = "200px",
	title = "Button",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="contained"
		color="error"
	/>
);

export const InfoBackgroundButton = ({
	id = "info-background-button",
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor = "white",
	size = "",
	width = "200px",
	title = "Button",
	onClick,
}) => (
	<BaseButton
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		titleClassName={titleClassName}
		titleColor={titleColor}
		size={size}
		width={width}
		title={title}
		onClick={onClick}
		variant="contained"
		color="info"
	/>
);
