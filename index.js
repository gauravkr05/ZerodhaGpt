import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { placeOrder } from "./trade.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
});
server.registerTool(
    "BUY a Stock",
    {
      description: "Buy a stock with a quantity in real time",
      inputSchema: { stock: z.string(),quantity: z.number() }
    },
    async ({stock,quantity }) => {
       await placeOrder(stock,"BUY",quantity);
      return {
        content: [{ type: "text", text: "order placed successfully" }]
      };
    }
  );
  server.registerTool(
    "SELL a Stock",
    {
      description: "Selling a stock with a quantity in real time",
      inputSchema: { stock: z.string(),quantity: z.number() }
    },
    async ({ stock,quantity }) => {
      await placeOrder(stock,"SELL",quantity);
      return {
        content: [{ type: "text", text: "order placed successfully" }]
      };
    }
  );


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("🟢 MCP Server connected and ready.");