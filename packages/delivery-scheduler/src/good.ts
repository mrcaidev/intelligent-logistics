import type { Graph } from "./graph";

/**
 * Configurable properties of goods.
 */
type Config = {
  name: string;
  departure: string;
  destination: string;
  isVip?: boolean;
  strategy: Graph;
};

/**
 * Goods delivered in the logistics system.
 */
export class Good {
  /**
   * Unique id of the good.
   */
  public readonly id = Good.generateId();

  /**
   * Name of the good.
   */
  public readonly name;

  /**
   * Time when the good is created.
   */
  public readonly createdAt = new Date();

  /**
   * Departure node.
   */
  public readonly departure: string;

  /**
   * Destination node.
   */
  public readonly destination: string;

  /**
   * Whether the good is from a VIP user.
   */
  public readonly isVip: boolean;

  /**
   * Delivery strategy of this good.
   * This is a graph, whose shortest path will be the delivery path.
   */
  private strategy: Graph;

  /**
   * Create a good.
   * @param config The configurable properties of the good.
   */
  constructor(config: Config) {
    this.name = config.name;
    this.departure = config.departure;
    this.destination = config.destination;
    this.isVip = config.isVip ?? false;
    this.strategy = config.strategy;
  }

  /**
   * Get the delivery path of this good.
   * @returns A list of nodes.
   */
  public getPath() {
    return this.strategy.getShortestPath(this.departure, this.destination);
  }

  /**
   * Set the delivery strategy.
   * @param strategy Desired delivery strategy.
   */
  public setStrategy(strategy: Graph) {
    this.strategy = strategy;
  }

  /**
   * Generate a random id.
   * @returns The generated id.
   */
  private static generateId() {
    return Math.random().toString(36).substring(2, 10);
  }
}
