import type { ScheduledTask } from './types.js';

export class Scheduler {
  private readonly tasks: Map<string, { task: ScheduledTask; timer: ReturnType<typeof setInterval> }> = new Map();

  add(task: ScheduledTask): this {
    if (this.tasks.has(task.name)) {
      console.warn(`[Scheduler] Task "${task.name}" already registered`);
      return this;
    }

    if (task.runOnStart) {
      Promise.resolve(task.execute()).catch((err) =>
        console.error(`[Scheduler] "${task.name}" initial run:`, err),
      );
    }

    const timer = setInterval(() => {
      Promise.resolve(task.execute()).catch((err) =>
        console.error(`[Scheduler] "${task.name}":`, err),
      );
    }, task.interval);

    this.tasks.set(task.name, { task, timer });
    console.info(`[Scheduler] Registered task "${task.name}" (${task.interval}ms)`);

    return this;
  }

  remove(name: string): boolean {
    const entry = this.tasks.get(name);
    if (!entry) return false;

    clearInterval(entry.timer);
    this.tasks.delete(name);
    console.info(`[Scheduler] Removed task "${name}"`);
    return true;
  }

  stopAll(): void {
    for (const [name, entry] of this.tasks) {
      clearInterval(entry.timer);
      console.info(`[Scheduler] Stopped task "${name}"`);
    }
    this.tasks.clear();
  }

  list(): string[] {
    return [...this.tasks.keys()];
  }
}
