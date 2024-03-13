import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...output: any[]) {
    if (!isDevMode()) return;

    console.log(...output);
  }
}
