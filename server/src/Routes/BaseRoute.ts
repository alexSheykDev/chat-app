import { Router } from 'express';

export abstract class BaseRoute {
  public abstract path: string;
  public abstract router: Router;

  // Want to shaow the use casse of BaseRoute Abstraction
  public logInitialized(): void {
    console.info(`[Route] Initialized: ${this.constructor.name} → ${this.path}`);
  }
}
