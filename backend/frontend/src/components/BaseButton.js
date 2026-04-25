import { Button, Typography } from "@mui/material";

const BaseButton = ({
	id,
	type,
	disabled,
	className,
	titleClassName,
	titleColor,
	size,
	width,
	title,
	onClick,
	variant,
	color,
	backgroundColor,
	borderColor,
}) => (
	<Button
		key={id}
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		variant={variant}
		color={color}
		size={size || ""}
		style={{
			...(width && { width }),
			...(variant === "outlined" && {
				backgroundColor: backgroundColor || "white",
				borderWidth: "3px",
			}),
			...(borderColor && { borderColor }),
		}}
		onClick={onClick}
	>
		<Typography className={titleClassName} sx={{ color: `${titleColor}!important` }} style={{ textTransform: "none" }}>
			<b>{title}</b>
		</Typography>
	</Button>
);

export default BaseButton;
