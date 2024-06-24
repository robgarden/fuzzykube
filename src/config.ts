import os from "os"
import path from "path"

import dotenv from "dotenv"

dotenv.config()

export const config = {
  configDir: process.env['FUZZYKUBE_CONFIG_DIR'] ?? path.join(os.homedir(), '.config', 'fuzzykube'),
  terminalApp: process.env['FUZZYKUBE_TERMINAL_APP'] ?? 'Warp',
  viewEnvAlias: process.env['FUZZYKUBE_VIEW_ENV_ALIAS'],
  editEnvAlias: process.env['FUZZYKUBE_EDIT_ENV_ALIAS'],
}
