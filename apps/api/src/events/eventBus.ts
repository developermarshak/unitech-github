import { EventEmitter } from "node:events";

/**
 * Simple event bus based on Node.js EventEmitter.
 *
 * We keep it tiny on purpose – it just needs to be injectable through tsyringe
 * and shared as a singleton across the whole application.
 */
export class EventBus extends EventEmitter {}
