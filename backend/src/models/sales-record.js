import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const months = [
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

const salesRecordSchema = new Schema(
	{
		category: { type: String, required: true, trim: true },
		month: { type: String, required: true, enum: months },
		year: { type: Number, required: true, min: 2000, max: 3000 },
		value: { type: Number, required: true, min: 0 },
		unit: { type: String, required: true, trim: true },
		notes: { type: String, default: "", trim: true },
		createdBy: { type: mongoose.Types.ObjectId, ref: "users", required: true },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

salesRecordSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("sales_record", salesRecordSchema);
