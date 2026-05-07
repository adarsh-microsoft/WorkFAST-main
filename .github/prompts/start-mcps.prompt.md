---
description: Start (or restart) every MCP server declared in .vscode/mcp.json for this workspace, in the current VS Code window. No new window is opened.
---

You are being asked to start all MCP servers for the WorkFAST workspace.

## Procedure

1. Read `.vscode/mcp.json` (or `.vscode/mcp.template.json` if `mcp.json` is missing) and extract every key under `servers`.
2. For each server name, dispatch the VS Code command **`workbench.mcp.startServer`** with the server name as its single argument, using the `run_vscode_command` tool. Run them in parallel where possible.
3. After dispatching all start commands, output a concise summary table:

   | # | Server | Action |
   |---|--------|--------|
   | 1 | <name> | start dispatched |
   | … | … | … |

4. Tell the user to verify with **Ctrl+Shift+P → `MCP: List Servers`** and report any servers that are still **Stopped** or **Error**.
5. If a server is reported as in error state, diagnose by:
   - For stdio servers: run the configured `command` + `args` in a terminal, capture stderr, fix the bootstrap script.
   - For http servers: instruct the user to click the server in `MCP: List Servers` to trigger the auth/sign-in dialog.

## Constraints

- Do NOT open a new VS Code window. Use only `run_vscode_command` against the running window.
- Do NOT use the bulk command `workbench.mcp.startAllServers` — call per server so each one is explicitly targeted.
- Do NOT modify `.vscode/mcp.json` unless the user asks.
