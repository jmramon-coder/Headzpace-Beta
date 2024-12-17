type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private groupLevel = 0;

  private getPrefix(): string {
    return `[Workspace] ${' '.repeat(this.groupLevel * 2)}`;
  }

  private log(level: LogLevel, ...args: unknown[]): void {
    const prefix = this.getPrefix();
    switch (level) {
      case 'info':
        console.log(prefix, ...args);
        break;
      case 'warn':
        console.warn(prefix, ...args);
        break;
      case 'error':
        console.error(prefix, ...args);
        break;
      case 'debug':
        console.debug(prefix, ...args);
        break;
    }
  }

  group(label: string): void {
    console.group(`${this.getPrefix()}${label}`);
    this.groupLevel++;
  }

  groupEnd(): void {
    console.groupEnd();
    this.groupLevel = Math.max(0, this.groupLevel - 1);
  }

  info(...args: unknown[]): void {
    this.log('info', ...args);
  }

  warn(...args: unknown[]): void {
    this.log('warn', ...args);
  }

  error(...args: unknown[]): void {
    this.log('error', ...args);
  }

  debug(...args: unknown[]): void {
    this.log('debug', ...args);
  }
}

export const logger = new Logger();