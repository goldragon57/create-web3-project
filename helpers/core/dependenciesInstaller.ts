import { execSync } from "child_process";
import chalk from "chalk";
import { selfDestroy } from "./selfDestroy.js";
import path from "path";
import { generatePackageDotJson } from "../utils/generatePackageDotJson.js";
import { BuilderContext } from "../../interfaces/BuilderContext";
export const installDependencies = async ({
	dappInfo,
	contractInfo,
	projectName,
	resolvedProjectPath,
}: BuilderContext) => {
	try {
		const { isEVM, useBackend, backendProvider, hasSmartContract, isTestnet } =
			dappInfo;

		generatePackageDotJson(
			projectName,
			isEVM,
			isTestnet,
			useBackend,
			backendProvider,
			hasSmartContract,
			contractInfo?.name
		);
		if (useBackend) {
			process.chdir("backend");
			execSync("npx npm-check-updates -u");
			execSync("npm install --loglevel=error");
		}

		if (useBackend) {
			process.chdir(path.join(resolvedProjectPath, "frontend"));
		} else {
			process.chdir(resolvedProjectPath);
		}
	
		execSync("npx npm-check-updates -u");
		execSync("npm install --loglevel=error");
		process.chdir(resolvedProjectPath);
	} catch (e) {
		selfDestroy(e);
	}
};
