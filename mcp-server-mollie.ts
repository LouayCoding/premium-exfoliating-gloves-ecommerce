#!/usr/bin/env node

/**
 * Mollie MCP Server
 * Provides Model Context Protocol tools for Mollie payment operations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import createMollieClient, { PaymentStatus } from '@mollie/api-client';

// Initialize Mollie client
const mollieApiKey = process.env.MOLLIE_API_KEY;
if (!mollieApiKey) {
  throw new Error('MOLLIE_API_KEY environment variable is required');
}

const mollieClient = createMollieClient({ apiKey: mollieApiKey });

// Create MCP server
const server = new Server(
  {
    name: 'mollie-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_payment',
        description: 'Get details of a Mollie payment by ID',
        inputSchema: {
          type: 'object',
          properties: {
            paymentId: {
              type: 'string',
              description: 'The Mollie payment ID (e.g., tr_xxxxx)',
            },
          },
          required: ['paymentId'],
        },
      },
      {
        name: 'list_payments',
        description: 'List recent Mollie payments',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Number of payments to return (default: 10)',
              default: 10,
            },
          },
        },
      },
      {
        name: 'create_payment',
        description: 'Create a new Mollie payment',
        inputSchema: {
          type: 'object',
          properties: {
            amount: {
              type: 'object',
              properties: {
                value: {
                  type: 'string',
                  description: 'Amount in EUR (e.g., "10.00")',
                },
                currency: {
                  type: 'string',
                  description: 'Currency code (default: EUR)',
                  default: 'EUR',
                },
              },
              required: ['value'],
            },
            description: {
              type: 'string',
              description: 'Payment description',
            },
            redirectUrl: {
              type: 'string',
              description: 'URL to redirect after payment',
            },
            webhookUrl: {
              type: 'string',
              description: 'Webhook URL for payment status updates',
            },
          },
          required: ['amount', 'description', 'redirectUrl'],
        },
      },
      {
        name: 'cancel_payment',
        description: 'Cancel a Mollie payment',
        inputSchema: {
          type: 'object',
          properties: {
            paymentId: {
              type: 'string',
              description: 'The Mollie payment ID to cancel',
            },
          },
          required: ['paymentId'],
        },
      },
      {
        name: 'create_refund',
        description: 'Create a refund for a payment',
        inputSchema: {
          type: 'object',
          properties: {
            paymentId: {
              type: 'string',
              description: 'The Mollie payment ID',
            },
            amount: {
              type: 'object',
              properties: {
                value: {
                  type: 'string',
                  description: 'Refund amount (e.g., "10.00")',
                },
                currency: {
                  type: 'string',
                  description: 'Currency code (default: EUR)',
                  default: 'EUR',
                },
              },
              required: ['value'],
            },
          },
          required: ['paymentId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    return {
      content: [
        {
          type: 'text',
          text: 'Error: Missing arguments',
        },
      ],
      isError: true,
    };
  }

  try {
    switch (name) {
      case 'get_payment': {
        const paymentId = args.paymentId as string;
        const payment = await mollieClient.payments.get(paymentId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(payment, null, 2),
            },
          ],
        };
      }

      case 'list_payments': {
        const limit = (args.limit as number) || 10;
        const payments = await mollieClient.payments.page({ limit });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(payments, null, 2),
            },
          ],
        };
      }

      case 'create_payment': {
        const amount = args.amount as { value: string; currency?: string };
        const payment = await mollieClient.payments.create({
          amount: {
            value: amount.value,
            currency: amount.currency || 'EUR',
          },
          description: args.description as string,
          redirectUrl: args.redirectUrl as string,
          webhookUrl: args.webhookUrl as string | undefined,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(payment, null, 2),
            },
          ],
        };
      }

      case 'cancel_payment': {
        const paymentId = args.paymentId as string;
        const payment = await mollieClient.payments.cancel(paymentId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(payment, null, 2),
            },
          ],
        };
      }

      case 'create_refund': {
        const paymentId = args.paymentId as string;
        const amountData = args.amount as { value: string; currency?: string } | undefined;
        const refundData: any = {
          paymentId: paymentId,
        };
        if (amountData) {
          refundData.amount = {
            value: amountData.value,
            currency: amountData.currency || 'EUR',
          };
        }
        const refund = await mollieClient.paymentRefunds.create(refundData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(refund, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Mollie MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
