/**
 * Console output utilities and error handling
 */

// ============================================================================
// Exit Codes
// ============================================================================

export const ExitCode = {
  SUCCESS: 0,
  GENERAL_ERROR: 1,
  INVALID_ARGUMENT: 2,
  FILE_NOT_FOUND: 3,
  PORT_IN_USE: 4,
  DEPENDENCY_MISSING: 5,
  BUILD_FAILED: 6,
  EXPORT_FAILED: 7,
} as const;

export type ExitCodeType = (typeof ExitCode)[keyof typeof ExitCode];

// ============================================================================
// Colors
// ============================================================================

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

// ============================================================================
// Output Functions
// ============================================================================

export function success(message: string): void {
  console.log(`${colors.green}${message}${colors.reset}`);
}

export function error(message: string): void {
  console.error(`${colors.red}Error: ${message}${colors.reset}`);
}

export function info(message: string): void {
  console.log(`${colors.blue}${message}${colors.reset}`);
}

export function header(message: string): void {
  console.log(`\n${colors.bold}${message}${colors.reset}`);
}

// ============================================================================
// Error Handling
// ============================================================================

interface ExitOptions {
  code?: ExitCodeType;
  hint?: string;
  hints?: string[];
}

/**
 * Print error message and exit with appropriate code
 */
export function exitWithError(
  message: string,
  options: ExitOptions = {},
): never {
  const { code = ExitCode.GENERAL_ERROR, hint, hints } = options;

  error(message);

  const allHints = hints ?? (hint ? [hint] : []);
  if (allHints.length > 0) {
    console.log("");
    info("Solutions:");
    for (const h of allHints) {
      console.log(`  ${h}`);
    }
  }

  process.exit(code);
}

/**
 * Exit due to missing slides.md
 */
export function exitNoSlides(): never {
  exitWithError("No slides.md found in current directory", {
    code: ExitCode.FILE_NOT_FOUND,
    hint: "preso init    # Create a new presentation",
  });
}

/**
 * Exit due to invalid port
 */
export function exitInvalidPort(port: string | undefined): never {
  exitWithError(`Invalid port: ${port}`, {
    code: ExitCode.INVALID_ARGUMENT,
    hint: "Port must be a number between 1-65535",
  });
}

/**
 * Exit due to port in use
 */
export function exitPortInUse(port: number, command: string): never {
  exitWithError(`Port ${port} is already in use`, {
    code: ExitCode.PORT_IN_USE,
    hints: [
      `preso ${command} -p ${port + 1}    # Use different port`,
      `lsof -i :${port}              # Find what's using it`,
    ],
  });
}

/**
 * Exit due to missing dependency
 */
export function exitMissingDependency(
  dependency: string,
  installCmd: string,
): never {
  exitWithError(`${dependency} is required but not installed`, {
    code: ExitCode.DEPENDENCY_MISSING,
    hint: installCmd,
  });
}

// ============================================================================
// Spinner
// ============================================================================

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
