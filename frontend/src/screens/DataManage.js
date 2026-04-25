import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	IconButton,
	Paper,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	TextField,
	Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import Spinner from "../components/Spinner.js";
import { SecondaryBackgroundButton, SecondaryBorderButton } from "../components/Buttons.js";
import { createSalesRecord, deleteSalesRecord, getSalesRecords, updateSalesRecord } from "../api/index.js";
import { useSnackbar } from "../utils/index.js";

const monthOptions = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const defaultFormValues = {
	category: "",
	month: "January",
	year: new Date().getFullYear(),
	value: "",
	unit: "",
	notes: "",
};

const sortRows = (rows, orderBy, order) => {
	const copy = [...rows];
	copy.sort((a, b) => {
		const aValue = a?.[orderBy];
		const bValue = b?.[orderBy];

		if (aValue === bValue) return 0;
		if (aValue === undefined || aValue === null) return order === "asc" ? -1 : 1;
		if (bValue === undefined || bValue === null) return order === "asc" ? 1 : -1;

		if (typeof aValue === "number" && typeof bValue === "number") {
			return order === "asc" ? aValue - bValue : bValue - aValue;
		}

		const comp = String(aValue).localeCompare(String(bValue));
		return order === "asc" ? comp : -comp;
	});
	return copy;
};

const DataManage = () => {
	const { success, error } = useSnackbar();
	const [isLoading, setIsLoading] = useState(false);
	const [records, setRecords] = useState([]);
	const [formOpen, setFormOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [formValues, setFormValues] = useState(defaultFormValues);
	const [formErrors, setFormErrors] = useState({});
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [orderBy, setOrderBy] = useState("year");
	const [order, setOrder] = useState("desc");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const fetchRecords = useCallback(async () => {
		setIsLoading(true);
		try {
			const { success: ok, records: next } = await getSalesRecords();
			if (!ok) {
				error("Could not load sales records.");
				return;
			}
			setRecords(next || []);
		} catch {
			error("Could not load sales records.");
		} finally {
			setIsLoading(false);
		}
	}, [error]);

	useEffect(() => {
		(async () => {
			await fetchRecords();
		})();
	}, [fetchRecords]);

	const resetForm = useCallback(() => {
		setEditingId(null);
		setFormValues(defaultFormValues);
		setFormErrors({});
	}, []);

	const validateForm = useCallback(() => {
		const nextErrors = {};
		if (!String(formValues.category || "").trim()) nextErrors.category = "Category is required.";
		if (!String(formValues.month || "").trim()) nextErrors.month = "Month is required.";

		const yearValue = Number(formValues.year);
		if (!Number.isFinite(yearValue) || yearValue < 2000 || yearValue > 3000) {
			nextErrors.year = "Year must be between 2000 and 3000.";
		}

		const valueNumber = Number(formValues.value);
		if (!Number.isFinite(valueNumber) || valueNumber < 0) {
			nextErrors.value = "Value must be a non-negative number.";
		}

		if (!String(formValues.unit || "").trim()) nextErrors.unit = "Unit is required.";

		setFormErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}, [formValues]);

	const openAddForm = useCallback(() => {
		resetForm();
		setFormOpen(true);
	}, [resetForm]);

	const openEditForm = useCallback((record) => {
		setEditingId(record._id);
		setFormValues({
			category: record.category,
			month: record.month,
			year: record.year,
			value: record.value,
			unit: record.unit,
			notes: record.notes || "",
		});
		setFormErrors({});
		setFormOpen(true);
	}, []);

	const closeForm = useCallback(() => {
		setFormOpen(false);
		resetForm();
	}, [resetForm]);

	const submitForm = useCallback(async () => {
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const payload = {
				category: String(formValues.category).trim(),
				month: formValues.month,
				year: Number(formValues.year),
				value: Number(formValues.value),
				unit: String(formValues.unit).trim(),
				notes: String(formValues.notes || "").trim(),
			};

			const response = editingId ? await updateSalesRecord(editingId, payload) : await createSalesRecord(payload);

			if (!response?.success) {
				error(response?.message || "Could not save record.");
				return;
			}

			success(editingId ? "Record updated." : "Record added.");
			setFormOpen(false);
			resetForm();
			await fetchRecords();
		} catch {
			error("Could not save record.");
		} finally {
			setIsLoading(false);
		}
	}, [editingId, error, fetchRecords, formValues, resetForm, success, validateForm]);

	const askDelete = useCallback((record) => {
		setDeleteTarget(record);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!deleteTarget?._id) return;
		setIsLoading(true);
		try {
			const response = await deleteSalesRecord(deleteTarget._id);
			if (!response?.success) {
				error(response?.message || "Could not delete record.");
				return;
			}
			success("Record deleted.");
			setDeleteTarget(null);
			await fetchRecords();
		} catch {
			error("Could not delete record.");
		} finally {
			setIsLoading(false);
		}
	}, [deleteTarget, error, fetchRecords, success]);

	const sortedRecords = useMemo(() => sortRows(records, orderBy, order), [records, orderBy, order]);
	const pagedRecords = useMemo(() => {
		const start = page * rowsPerPage;
		return sortedRecords.slice(start, start + rowsPerPage);
	}, [page, rowsPerPage, sortedRecords]);

	const handleSort = (column) => {
		if (orderBy === column) {
			setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			return;
		}
		setOrderBy(column);
		setOrder("asc");
	};

	return (
		<>
			<Spinner open={isLoading} />
			<Grid id="sales-data-page" container direction="column" spacing={2}>
				<Grid item container justifyContent="space-between" alignItems="center">
					<Typography variant="h4" color="white.main">
						{"Sales Data"}
					</Typography>
					<SecondaryBackgroundButton id="sales-data-add-button" title="Add Record" onClick={openAddForm} />
				</Grid>

				<Grid item>
					<TableContainer component={Paper}>
						<Table id="sales-data-table">
							<TableHead>
								<TableRow>
									{[
										["category", "Category"],
										["month", "Month"],
										["year", "Year"],
										["value", "Value"],
										["unit", "Unit"],
										["notes", "Notes"],
									].map(([key, label]) => (
										<TableCell key={key}>
											<TableSortLabel
												active={orderBy === key}
												direction={orderBy === key ? order : "asc"}
												onClick={() => handleSort(key)}
											>
												{label}
											</TableSortLabel>
										</TableCell>
									))}
									<TableCell align="right">{"Actions"}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{pagedRecords.length === 0 && (
									<TableRow>
										<TableCell colSpan={7}>
											<Typography id="sales-data-empty" align="center" color="text.secondary">
												{"No sales records found."}
											</Typography>
										</TableCell>
									</TableRow>
								)}
								{pagedRecords.map((record) => (
									<TableRow id={`sales-data-row-${record._id}`} key={record._id}>
										<TableCell>{record.category}</TableCell>
										<TableCell>{record.month}</TableCell>
										<TableCell>{record.year}</TableCell>
										<TableCell>{record.value}</TableCell>
										<TableCell>{record.unit}</TableCell>
										<TableCell>{record.notes || "-"}</TableCell>
										<TableCell align="right">
											<IconButton id={`sales-data-edit-${record._id}`} onClick={() => openEditForm(record)}>
												<EditIcon />
											</IconButton>
											<IconButton
												id={`sales-data-delete-${record._id}`}
												color="error"
												onClick={() => askDelete(record)}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Box id="sales-data-pagination">
							<TablePagination
								component="div"
								count={sortedRecords.length}
								page={page}
								onPageChange={(_event, nextPage) => setPage(nextPage)}
								rowsPerPage={rowsPerPage}
								onRowsPerPageChange={(event) => {
									setRowsPerPage(Number(event.target.value));
									setPage(0);
								}}
								rowsPerPageOptions={[5, 10, 25]}
							/>
						</Box>
					</TableContainer>
				</Grid>
			</Grid>

			<Dialog open={formOpen} onClose={closeForm}>
				<DialogTitle>{editingId ? "Edit Record" : "Add Record"}</DialogTitle>
				<DialogContent>
					<Grid id="sales-data-form" container spacing={2} sx={{ minWidth: 460, pt: 1 }}>
						<Grid item xs={12} sm={6}>
							<TextField
								id="sales-data-field-category"
								fullWidth
								label="Category"
								value={formValues.category}
								error={Boolean(formErrors.category)}
								helperText={formErrors.category}
								onChange={(event) => setFormValues((prev) => ({ ...prev, category: event.target.value }))}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="sales-data-field-month"
								select
								fullWidth
								label="Month"
								value={formValues.month}
								error={Boolean(formErrors.month)}
								helperText={formErrors.month}
								onChange={(event) => setFormValues((prev) => ({ ...prev, month: event.target.value }))}
							>
								{monthOptions.map((month) => (
									<MenuItem key={month} value={month}>
										{month}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="sales-data-field-year"
								fullWidth
								type="number"
								label="Year"
								value={formValues.year}
								error={Boolean(formErrors.year)}
								helperText={formErrors.year}
								onChange={(event) => setFormValues((prev) => ({ ...prev, year: event.target.value }))}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="sales-data-field-value"
								fullWidth
								type="number"
								label="Value"
								value={formValues.value}
								error={Boolean(formErrors.value)}
								helperText={formErrors.value}
								onChange={(event) => setFormValues((prev) => ({ ...prev, value: event.target.value }))}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="sales-data-field-unit"
								fullWidth
								label="Unit"
								value={formValues.unit}
								error={Boolean(formErrors.unit)}
								helperText={formErrors.unit}
								onChange={(event) => setFormValues((prev) => ({ ...prev, unit: event.target.value }))}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="sales-data-field-notes"
								fullWidth
								label="Notes"
								multiline
								minRows={2}
								value={formValues.notes}
								onChange={(event) => setFormValues((prev) => ({ ...prev, notes: event.target.value }))}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<SecondaryBorderButton id="sales-data-form-cancel" title="Cancel" onClick={closeForm} />
					<SecondaryBackgroundButton
						id="sales-data-form-submit"
						title={editingId ? "Save" : "Add"}
						onClick={submitForm}
					/>
				</DialogActions>
			</Dialog>

			<Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
				<DialogTitle>{"Delete record?"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{`Are you sure you want to delete ${deleteTarget?.category || "this record"}?`}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<SecondaryBorderButton id="sales-data-delete-cancel" title="Cancel" onClick={() => setDeleteTarget(null)} />
					<SecondaryBackgroundButton id="sales-data-delete-confirm" title="Delete" onClick={confirmDelete} />
				</DialogActions>
			</Dialog>
		</>
	);
};

export default memo(DataManage);
