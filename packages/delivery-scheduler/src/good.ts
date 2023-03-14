import type { Graph } from "./graph";

/**
 * The configurable properties of goods.
 */
type Config = {
  name: string;
  departure: string;
  destination: string;
  isVip?: boolean;
  strategy: Graph;
};

/**
 * The items delivered in the logistics system.
 */
export class Good {
  /**
   * The unique id of the good.
   */
  public readonly id = Good.generateId();

  /**
   * The name of the good.
   */
  public readonly name;

  /**
   * The time when the good is created.
   */
  public readonly createdAt = new Date();

  /**
   * The departure node.
   */
  public readonly departure: string;

  /**
   * The destination node.
   */
  public readonly destination: string;

  /**
   * Whether the good is from a VIP user.
   */
  public readonly isVip: boolean;

  /**
   * The delivery strategy of this good.
   * This is a graph, whose shortest path
   * will be selected as the delivery path.
   */
  private strategy: Graph;

  constructor(config: Config) {
    this.name = config.name;
    this.departure = config.departure;
    this.destination = config.destination;
    this.isVip = config.isVip ?? false;
    this.strategy = config.strategy;
  }

  /**
   * Returns the delivery path.
   */
  public getPath() {
    return this.strategy.getShortestPath(this.departure, this.destination);
  }

  /**
   * Sets the delivery strategy.
   */
  public setStrategy(strategy: Graph) {
    this.strategy = strategy;
  }

  /**
   * Generates a random id.
   */
  private static generateId() {
    return Math.random().toString(36).substring(2, 10);
  }
}
