/**
 * Console output utilities
 */

export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

export function success(message: string): void {
  console.log(`${colors.green}${message}${colors.reset}`);
}

export function error(message: string): void {
  console.error(`${colors.red}Error: ${message}${colors.reset}`);
}

export function warn(message: string): void {
  console.warn(`${colors.yellow}Warning: ${message}${colors.reset}`);
}

export function info(message: string): void {
  console.log(`${colors.blue}${message}${colors.reset}`);
}

export function dim(message: string): void {
  console.log(`${colors.dim}${message}${colors.reset}`);
}

export function header(message: string): void {
  console.log(`\n${colors.bold}${message}${colors.reset}`);
}

/**
 * Format a list item with optional marker
 */
export function listItem(item: string, isCurrent: boolean = false): string {
  if (isCurrent) {
    return `  ${colors.green}* ${item} (current)${colors.reset}`;
  }
  return `    ${item}`;
}

/**
 * Simple spinner for async operations
 */
export class Spinner {
  private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private current = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  start(): this {
    process.stdout.write(`${this.frames[0]} ${this.message}`);
    this.interval = setInterval(() => {
      this.current = (this.current + 1) % this.frames.length;
      process.stdout.write(`\r${this.frames[this.current]} ${this.message}`);
    }, 80);
    return this;
  }

  stop(finalMessage?: string): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    process.stdout.write(`\r${" ".repeat(this.message.length + 4)}\r`);
    if (finalMessage) {
      console.log(finalMessage);
    }
  }

  succeed(message?: string): void {
    this.stop(`${colors.green}✔${colors.reset} ${message || this.message}`);
  }

  fail(message?: string): void {
    this.stop(`${colors.red}✖${colors.reset} ${message || this.message}`);
  }
}
