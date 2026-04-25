import express from "express";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve, normalize } from "path";

const router = express.Router({ mergeParams: true });

const getSafePath = (baseDir, userInput) => {
	const root = resolve(baseDir);
	const safePath = normalize(join(root, userInput));

	if (!safePath.startsWith(root)) {
		throw new Error("Path Traversal Detected");
	}
	return safePath;
};

const generateRandomData = (min = 0, max = 10) => Math.random() * (max - min) + min;

router.get("/", async (req, res) => {
	try {
		const quarterlySalesDistribution = {
			Q1: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
			Q2: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
			Q3: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
		};

		const budgetVsActual = {
			January: {
				budget: generateRandomData(0, 100),
				actual: generateRandomData(0, 100),
				forecast: generateRandomData(0, 100),
			},
			February: {
				budget: generateRandomData(0, 100),
				actual: generateRandomData(0, 100),
				forecast: generateRandomData(0, 100),
			},
			March: {
				budget: generateRandomData(0, 100),
				actual: generateRandomData(0, 100),
				forecast: generateRandomData(0, 100),
			},
			April: {
				budget: generateRandomData(0, 100),
				actual: generateRandomData(0, 100),
				forecast: generateRandomData(0, 100),
			},
			May: {
				budget: generateRandomData(0, 100),
				actual: generateRandomData(0, 100),
				forecast: generateRandomData(0, 100),
			},
			June: {
				budget: generateRandomData(0, 100),
				actual: generateRandomData(0, 100),
				forecast: generateRandomData(0, 100),
			},
		};

		const timePlot = {
			projected: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
			actual: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
			historicalAvg: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
		};

		return res.json({ success: true, quarterlySalesDistribution, budgetVsActual, timePlot });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.get("/download-report", (req, res) => {
	try {
		const { reportName } = req.query;
		if (!reportName) return res.status(400).json({ message: "Report name required" });

		const reportPath = getSafePath("./reports", reportName);

		if (existsSync(reportPath)) {
			return res.download(reportPath);
		}
		return res.status(404).json({ message: "Report not found" });
	} catch (error) {
		return res.status(403).json({ message: "Access denied" });
	}
});

router.get("/render-page", (req, res) => {
	try {
		const { template } = req.query;
		if (!template) return res.status(400).json({ message: "Template name required" });

		const templatePath = getSafePath("./templates", template);

		if (existsSync(templatePath)) {
			const templateContent = readFileSync(templatePath, "utf8");
			return res.send(templateContent);
		}
		return res.status(404).json({ message: "Template not found" });
	} catch (error) {
		return res.status(403).json({ message: "Access denied" });
	}
});

router.post("/upload-file", (req, res) => {
	try {
		const { filename, content } = req.body;
		if (!filename || !content) return res.status(400).json({ message: "Filename and content required" });

		const uploadPath = getSafePath("./uploads", filename);

		writeFileSync(uploadPath, content);
		return res.json({ success: true, message: "File uploaded successfully" });
	} catch (error) {
		return res.status(403).json({ message: "Access denied" });
	}
});

router.get("/export-csv", (req, res) => {
	try {
		const { dataFile } = req.query;
		if (!dataFile?.endsWith(".csv")) return res.status(400).json({ message: "Only CSV allowed" });

		const csvPath = getSafePath("./data", dataFile);

		if (existsSync(csvPath)) {
			return res.download(csvPath);
		}
		return res.status(404).json({ message: "File not found" });
	} catch (error) {
		return res.status(403).json({ message: "Access denied" });
	}
});

router.get("/browse-files", (req, res) => {
	try {
		const { directory } = req.query;
		if (!directory) return res.status(400).json({ message: "Directory required" });

		const dirPath = getSafePath("./files", directory);

		if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
			const files = readdirSync(dirPath).map((file) => {
				const stats = statSync(join(dirPath, file));
				return { name: file, size: stats.size, isDirectory: stats.isDirectory(), modified: stats.mtime };
			});
			return res.json({ success: true, files });
		}
		return res.status(404).json({ message: "Directory not found" });
	} catch (error) {
		return res.status(403).json({ message: "Access denied" });
	}
});

router.get("/config/load", (req, res) => {
	try {
		const { configFile } = req.query;
		if (!configFile?.endsWith(".json")) return res.status(400).json({ message: "Only JSON allowed" });

		const configPath = getSafePath("./config", configFile);

		if (existsSync(configPath)) {
			const config = readFileSync(configPath, "utf8");
			return res.json({ success: true, config: JSON.parse(config) });
		}
		return res.status(404).json({ message: "Config not found" });
	} catch (error) {
		return res.status(403).json({ message: "Access denied" });
	}
});

router.post("/generate-custom-report", (req, res) => {
	try {
		const { templateString, data } = req.body;
		if (!templateString) return res.status(400).json({ message: "Template string required" });

		const reportData = data || { username: "Unknown", date: new Date().toLocaleDateString(), totalUsers: 100 };
		const keys = Object.keys(reportData);
		const values = Object.values(reportData);

		const report = new Function(...keys, `return \`${templateString}\`;`)(...values);

		return res.json({ success: true, report, generatedAt: new Date() });
	} catch (error) {
		return res.status(500).json({ message: "Report generation failed" });
	}
});

export default router;
