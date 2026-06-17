# Privacy Notes — Educational Skills RU Local MCP

**Last updated: 17 June 2026**

## Overview

Educational Skills RU is documented as a local-only fork. The MCP server runs on your machine as a local process.

## Data Collection

The local MCP server collects no personal data. Specifically:

- It does not require authentication or user accounts
- It does not send requests to a public hosted endpoint
- It does not store any information about who is calling the server
- It does not store any information about what users do with the results
- It does not use cookies or tracking mechanisms
- It does not share any data with third parties

## How the Server Works

The server responds to MCP tool calls by returning skill prompts and metadata from the local `mcp-server/src/skills.json` snapshot. Skill tools assemble instruction-framed prompts for the calling model; they do not call a separate model themselves.

## Third-Party Services

There is no supported public hosted MCP service for this fork. If you configure your own remote server, you are responsible for that infrastructure, logs, and access controls.

## Open Source

The full source code for this fork is available at [github.com/dubr1k/education-agent-skills](https://github.com/dubr1k/education-agent-skills). Anyone can inspect exactly what the local server does.

## Contact

For setup details, see [LOCAL_MCP.md](LOCAL_MCP.md).
