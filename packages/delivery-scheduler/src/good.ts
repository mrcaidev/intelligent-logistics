import { generateRandomId } from "common";
import type { Graph } from "./graph";

/**
 * The configurable properties of goods.
 */
type Config = {
  name: string;
  source: string;
  target: string;
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
  public readonly id = generateRandomId();

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
  public readonly source: string;

  /**
   * The destination node.
   */
  public readonly target: string;

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
    this.source = config.source;
    this.target = config.target;
    this.isVip = config.isVip ?? false;
    this.strategy = config.strategy;
  }

  /**
   * Returns the delivery path.
   */
  public getPath() {
    return this.strategy.getShortestPath(this.source, this.target);
  }

  /**
   * Sets the delivery strategy.
   */
  public setStrategy(strategy: Graph) {
    this.strategy = strategy;
  }
}
