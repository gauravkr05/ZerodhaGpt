import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { placeOrder, getPosition } from "./trade.js";
import { z } from "zod";


const server = new McpServer({
  name: "zerodha-trade",
  version: "1.0.0",
  keepAlive: true
});

server.registerTool(
  "buy_stock",
  {  
      description: "Buy the stock in real time",
      inputSchema: { stock: z.string(), quantity: z.number() }  
  },
  async ({ stock, quantity }) => {
    try {
      const result = await placeOrder(stock, "BUY", quantity);
      return {
        content: [{
          type: "text",
          text: result.success 
            ? `✅ Order placed successfully. Order ID: ${result.order_id}`
            : `❌ Order failed: ${result.error}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: ${error.message}`
        }]
      };
    }
  }
);

server.registerTool(
  "sell_stock",{
    description: "Sell a stock in real time",
    inputSchema: { stock: z.string(), quantity: z.number() }
  },
  async ({ stock, quantity }) => {
    try {
      const result = await placeOrder(stock, "SELL", quantity);
      return {
        content: [{
          type: "text",
          text: result.success 
            ? `✅ Sell order placed successfully. Order ID: ${result.order_id}`
            : `❌ Sell order failed: ${result.error}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: ${error.message}`
        }]
      };
    }
  }
);

server.registerTool(
  "get_portfolio",
  {
    description: "Get current portfolio holdings",
    inputSchema: {
      
    }
  },
  async () => {
    try {
      const positions = await getPosition();
      return {
        content: [{
          type: "text",
          text: positions || "No positions found"
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error fetching portfolio: ${error.message}`
        }]
      };
    }
  }
);

// Start server with error handling
const transport = new StdioServerTransport();
// try {
  await server.connect(transport);
  console.error("🟢 MCP Server connected and ready.");
  
//   // Keep the process alive
//   process.stdin.resume();
  
//   // Handle graceful shutdown
//   process.on('SIGINT', () => {
//     console.error("Shutting down MCP server...");
//     process.exit(0);
//   });
  
//   // Handle uncaught errors
//   process.on('uncaughtException', (error) => {
//     console.error("Uncaught exception:", error);
//     process.exit(1);
//   });
// } catch (error) {
//   console.error("Failed to start MCP server:", error);
//   process.exit(1);
// }