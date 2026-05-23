import type {
  CommandDeclaration,
  MenuDeclaration,
  EventDeclaration,
  ComponentDeclaration,
} from './types.js';

export class CommandStore {
  public readonly items: CommandDeclaration[] = [];
  private readonly index = new Map<string, CommandDeclaration>();
  private readonly aliases = new Map<string, CommandDeclaration>();

  add(cmd: CommandDeclaration): void {
    this.items.push(cmd);
    this.index.set(cmd.name, cmd);

    for (const alias of cmd.aliases ?? []) {
      this.aliases.set(alias, cmd);
    }
  }

  get(name: string): CommandDeclaration | undefined {
    return this.index.get(name) ?? this.aliases.get(name);
  }

  slashable(): CommandDeclaration[] {
    return this.items.filter((cmd) => cmd.slash?.enabled !== false);
  }

  prefixable(): CommandDeclaration[] {
    return this.items.filter((cmd) => cmd.prefix?.enabled !== false);
  }
}

export class MenuStore {
  public readonly items: MenuDeclaration[] = [];
  private readonly index = new Map<string, MenuDeclaration>();

  add(menu: MenuDeclaration): void {
    this.items.push(menu);
    this.index.set(menu.name, menu);
  }

  get(name: string): MenuDeclaration | undefined {
    return this.index.get(name);
  }
}

export class EventStore {
  public readonly items: EventDeclaration[] = [];

  add(evt: EventDeclaration): void {
    this.items.push(evt);
  }
}

export class ComponentStore {
  public readonly items: ComponentDeclaration[] = [];

  add(comp: ComponentDeclaration): void {
    this.items.push(comp);
  }

  match(id: string): ComponentDeclaration | undefined {
    return this.items.find((comp) => {
      const pattern = comp.id
        .replace(/:(\w+)/g, '([^/]+)')
        .replace(/\//g, '\\/');

      return new RegExp(`^${pattern}$`).test(id);
    });
  }
}

export class Registry {
  public readonly commands = new CommandStore();
  public readonly menus = new MenuStore();
  public readonly events = new EventStore();
  public readonly components = new ComponentStore();
}
