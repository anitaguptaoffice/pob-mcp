import type { BuildService } from "../services/buildService.js";
import type { ValidationService } from "../services/validationService.js";
import type { PoBLuaApiClient, PoBLuaTcpClient } from "../pobLuaBridge.js";
import fs from "fs/promises";
import path from "path";

export interface ValidationHandlerContext {
  buildService: BuildService;
  validationService: ValidationService;
  pobDirectory?: string;
  getLuaClient?: () => PoBLuaApiClient | PoBLuaTcpClient | null;
  ensureLuaClient?: () => Promise<void>;
}

/**
 * Handle validate_build tool call
 */
export async function handleValidateBuild(
  context: ValidationHandlerContext,
  args?: { build_name?: string }
) {
  const { buildService, validationService, getLuaClient, ensureLuaClient } = context;

  let buildData;
  let luaStats;
  const buildName = args?.build_name;

  // Load build into Lua bridge for accurate stats
  if (getLuaClient && buildName && context.pobDirectory) {
    const luaClient = getLuaClient();

    if (luaClient) {
      try {
        const buildPath = path.join(context.pobDirectory, buildName);
        const buildXml = await fs.readFile(buildPath, 'utf-8');
        await luaClient.loadBuildXml(buildXml, buildName);
        luaStats = await luaClient.getStats();
      } catch (error) {
        // Lua stats failed, will fall back to XML
      }
    }
  }

  // Load build data from XML
  if (!buildName) {
    throw new Error("build_name is required");
  }

  buildData = await buildService.readBuild(buildName);

  // Parse flasks for immunity validation
  const flaskAnalysis = buildService.parseFlasks(buildData);

  // Run validation
  const validation = validationService.validateBuild(
    buildData,
    flaskAnalysis,
    luaStats
  );

  // Format output
  const formattedOutput = validationService.formatValidation(validation);

  return {
    content: [
      {
        type: "text" as const,
        text: formattedOutput,
      },
    ],
  };
}
