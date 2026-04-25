import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Paper, Typography, TextField, Divider } from "@mui/material";

import Spinner from "../components/Spinner.js";
import { SecondaryBackgroundButton } from "../components/Buttons.js";
import { changeMyPassword, getMyProfile, updateMyProfile } from "../api/index.js";
import { dayjs, jwt, useSnackbar } from "../utils/index.js";
import { passwordMinLength } from "../utils/constants.js";

const formatDate = (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-");

const Profile = () => {
	const { success, error } = useSnackbar();
	const [isLoading, setIsLoading] = useState(false);
	const [profile, setProfile] = useState(null);

	const [profileValues, setProfileValues] = useState({ username: "", email: "" });
	const [profileErrors, setProfileErrors] = useState({ username: "", email: "" });

	const [passwordValues, setPasswordValues] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [passwordErrors, setPasswordErrors] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const fetchProfile = useCallback(async () => {
		setIsLoading(true);
		try {
			const { success: ok, profile: nextProfile, message } = await getMyProfile();
			if (!ok) {
				error(message || "Could not load profile.");
				return;
			}

			setProfile(nextProfile);
			setProfileValues({
				username: nextProfile?.username || "",
				email: nextProfile?.email || "",
			});
		} catch {
			error("Could not load profile.");
		} finally {
			setIsLoading(false);
		}
	}, [error]);

	useEffect(() => {
		(async () => {
			await fetchProfile();
		})();
	}, [fetchProfile]);

	const validateProfile = useCallback(() => {
		const nextErrors = { username: "", email: "" };
		const username = profileValues.username.trim();
		const email = profileValues.email.trim();

		if (!username) nextErrors.username = "Username is required.";
		if (!email) {
			nextErrors.email = "E-mail is required.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			nextErrors.email = "Invalid e-mail address.";
		}

		setProfileErrors(nextErrors);
		return !nextErrors.username && !nextErrors.email;
	}, [profileValues.email, profileValues.username]);

	const validatePassword = useCallback(() => {
		const nextErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };
		const { currentPassword, newPassword, confirmPassword } = passwordValues;

		if (!currentPassword) nextErrors.currentPassword = "Current password is required.";
		if (!newPassword) {
			nextErrors.newPassword = "New password is required.";
		} else if (newPassword.length < passwordMinLength) {
			nextErrors.newPassword = `Password should contain at least ${passwordMinLength} characters.`;
		}
		if (!confirmPassword) {
			nextErrors.confirmPassword = "Please confirm the new password.";
		} else if (newPassword !== confirmPassword) {
			nextErrors.confirmPassword = "Passwords must match.";
		}

		setPasswordErrors(nextErrors);
		return !nextErrors.currentPassword && !nextErrors.newPassword && !nextErrors.confirmPassword;
	}, [passwordValues]);

	const canSaveProfile = useMemo(
		() =>
			profileValues.username.trim() !== (profile?.username || "") ||
			profileValues.email.trim().toLowerCase() !== (profile?.email || "").toLowerCase(),
		[profile?.email, profile?.username, profileValues.email, profileValues.username],
	);

	const saveProfile = useCallback(async () => {
		if (!validateProfile()) return;
		if (!canSaveProfile) {
			success("Nothing to update.");
			return;
		}

		setIsLoading(true);
		try {
			const {
				success: ok,
				profile: nextProfile,
				token,
				message,
			} = await updateMyProfile(profileValues.username.trim(), profileValues.email.trim());

			if (!ok) {
				error(message || "Failed to update profile.");
				return;
			}

			if (token) jwt.setToken(token);
			setProfile(nextProfile);
			setProfileValues({
				username: nextProfile?.username || "",
				email: nextProfile?.email || "",
			});
			success(message || "Profile updated successfully.");
		} catch {
			error("Failed to update profile.");
		} finally {
			setIsLoading(false);
		}
	}, [canSaveProfile, error, profileValues.email, profileValues.username, success, validateProfile]);

	const savePassword = useCallback(async () => {
		if (!validatePassword()) return;

		setIsLoading(true);
		try {
			const { success: ok, message } = await changeMyPassword(
				passwordValues.currentPassword,
				passwordValues.newPassword,
				passwordValues.confirmPassword,
			);
			if (!ok) {
				error(message || "Failed to change password.");
				return;
			}

			setPasswordValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
			setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
			success(message || "Password updated successfully.");
		} catch {
			error("Failed to change password.");
		} finally {
			setIsLoading(false);
		}
	}, [
		error,
		passwordValues.confirmPassword,
		passwordValues.currentPassword,
		passwordValues.newPassword,
		success,
		validatePassword,
	]);

	return (
		<>
			<Spinner open={isLoading} />
			<Grid container direction="column" spacing={2}>
				<Grid item>
					<Typography variant="h4" color="white.main">
						{"My Profile"}
					</Typography>
				</Grid>
				<Grid item>
					<Paper sx={{ p: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography variant="h6">{"Account details"}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography color="text.secondary">{"Role"}</Typography>
								<Typography>{profile?.role || "-"}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography color="text.secondary">{"Account created"}</Typography>
								<Typography>{formatDate(profile?.createdAt)}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography color="text.secondary">{"Last active"}</Typography>
								<Typography>{formatDate(profile?.lastActiveAt)}</Typography>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid item>
					<Paper sx={{ p: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography variant="h6">{"Edit profile"}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Username"
									value={profileValues.username}
									error={Boolean(profileErrors.username)}
									helperText={profileErrors.username}
									onChange={(event) => {
										setProfileValues((prev) => ({ ...prev, username: event.target.value }));
										setProfileErrors((prev) => ({ ...prev, username: "" }));
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="E-mail"
									type="email"
									value={profileValues.email}
									error={Boolean(profileErrors.email)}
									helperText={profileErrors.email}
									onChange={(event) => {
										setProfileValues((prev) => ({ ...prev, email: event.target.value }));
										setProfileErrors((prev) => ({ ...prev, email: "" }));
									}}
								/>
							</Grid>
							<Grid item xs={12} display="flex" justifyContent="flex-end">
								<SecondaryBackgroundButton title="Save profile" disabled={!canSaveProfile} onClick={saveProfile} />
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid item>
					<Paper sx={{ p: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography variant="h6">{"Change password"}</Typography>
							</Grid>
							<Grid item xs={12}>
								<Divider />
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label="Current password"
									type="password"
									value={passwordValues.currentPassword}
									error={Boolean(passwordErrors.currentPassword)}
									helperText={passwordErrors.currentPassword}
									onChange={(event) => {
										setPasswordValues((prev) => ({ ...prev, currentPassword: event.target.value }));
										setPasswordErrors((prev) => ({ ...prev, currentPassword: "" }));
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label="New password"
									type="password"
									value={passwordValues.newPassword}
									error={Boolean(passwordErrors.newPassword)}
									helperText={passwordErrors.newPassword}
									onChange={(event) => {
										setPasswordValues((prev) => ({ ...prev, newPassword: event.target.value }));
										setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label="Confirm password"
									type="password"
									value={passwordValues.confirmPassword}
									error={Boolean(passwordErrors.confirmPassword)}
									helperText={passwordErrors.confirmPassword}
									onChange={(event) => {
										setPasswordValues((prev) => ({ ...prev, confirmPassword: event.target.value }));
										setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
									}}
								/>
							</Grid>
							<Grid item xs={12} display="flex" justifyContent="flex-end">
								<SecondaryBackgroundButton title="Change password" onClick={savePassword} />
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
};

export default memo(Profile);
