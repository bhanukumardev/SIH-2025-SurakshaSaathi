import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const responseStream = new ReadableStream({
    start(controller) {
      // Keep connection alive
      controller.enqueue('retry: 10000\n\n');

      // For Vercel deployment, we'll implement a simple polling mechanism
      // In production, this would connect to a proper SSE server
      const interval = setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify({ time: Date.now(), status: 'connected' })}\n\n`);
      }, 30000); // Send heartbeat every 30 seconds

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
