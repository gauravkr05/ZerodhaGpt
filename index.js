import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { placeOrder, getPosition } from "./trade.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
});
server.registerTool(
  "BUYStock",
  {
    description: "Buy a stock with a quantity in real time",
    inputSchema: { stock: z.string(), quantity: z.number() }
  },
  async ({ stock, quantity }) => {
    const result = await placeOrder(stock, "BUY", quantity);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ Order placed successfully. Order ID: ${result.order_id}`
          }
        ]
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Order failed: ${result.error}`
          }
        ]
      };
    }
  }
);

server.registerTool(
  "SELLStock",
  {
    description: "Sell a stock with a quantity in real time",
    inputSchema: { stock: z.string(), quantity: z.number() }
  },
  async ({ stock, quantity }) => {
    const result = await placeOrder(stock, "SELL", quantity);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ Sell order placed successfully. Order ID: ${result.order_id}`
          }
        ]
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Sell order failed: ${result.error}`
          }
        ]
      };
    }
  }
);
server.registerTool(
  "show_portfolio",
  {
    description: "Give me all the stock with a quantity in real time",
    inputSchema: {}
  },
  async () => {
    const positions = await getPosition();
    return {
      content: [
        {
          type: "text",
          text: positions
        }
      ]
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("🟢 MCP Server connected and ready.");