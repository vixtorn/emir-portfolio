"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  resolveProject,
  terminalProjects,
  type TerminalProject,
} from "./project-catalog";
import { useTerminalDevice } from "./TerminalDevice";
import styles from "./PlaygroundTerminal.module.css";

type TerminalLineTone = "accent" | "command" | "error" | "muted" | "output";

type TerminalLine = {
  id: number;
  text: string;
  tone: TerminalLineTone;
};

type TerminalOutput = Omit<TerminalLine, "id">;

type TerminalCommandContext = {
  args: string[];
  rawInput: string;
};

type TerminalCommand = {
  description: string;
  execute: (context: TerminalCommandContext) => TerminalOutput[];
  name: string;
  usage?: string;
  clearsHistory?: boolean;
};

type PlaygroundTerminalProps = {
  onProjectOpenRequest?: (projectId: string) => void;
};

const prompt = "emir@playground:~ $";

const projectNotFound = (identifier: string): TerminalOutput[] => [
  { tone: "error", text: `project not found: ${identifier}` },
  { tone: "muted", text: 'run "projects" for available ids' },
];

const renderProjectDossier = (project: TerminalProject): TerminalOutput[] => [
  { tone: "accent", text: `PROJECT / ${project.index}` },
  { tone: "output", text: project.title },
  { tone: "muted", text: `TYPE        ${project.type}` },
  { tone: "muted", text: `STATUS      ${project.status}` },
  { tone: "accent", text: "STACK" },
  { tone: "output", text: project.stack.join(" / ") },
  { tone: "accent", text: "FOCUS" },
  ...project.focus.map((focus) => ({ tone: "output" as const, text: focus })),
  { tone: "accent", text: "COMMAND" },
  { tone: "output", text: `open ${project.id}` },
];

function createCommandRegistry(
  onProjectOpenRequest?: (projectId: string) => void,
): readonly TerminalCommand[] {
  const commands: TerminalCommand[] = [
    {
      name: "help",
      description: "list available commands",
      execute: () => [
        { tone: "accent", text: "AVAILABLE COMMANDS" },
        ...commands.map(({ description, name, usage }) => ({
          tone: "output" as const,
          text: `${(usage ?? name).padEnd(20)}${description}`,
        })),
      ],
    },
    {
      name: "whoami",
      description: "identify this operator",
      execute: () => [
        { tone: "output", text: "Creative Developer" },
        { tone: "output", text: "Product-minded Engineer" },
        { tone: "output", text: "Visual Experimenter" },
      ],
    },
    {
      name: "projects",
      description: "show selected projects",
      execute: () => [
        { tone: "accent", text: "SELECTED PROJECTS" },
        ...terminalProjects.flatMap((project) => [
          { tone: "output" as const, text: `${project.index}  ${project.title}` },
          { tone: "muted" as const, text: `    ${project.summary}` },
        ]),
        { tone: "muted", text: "inspect <id>" },
      ],
    },
    {
      name: "inspect",
      description: "view a project dossier",
      usage: "inspect <project>",
      execute: ({ args }) => {
        const [identifier] = args;
        if (!identifier) {
          return [{ tone: "error", text: "usage: inspect <project>" }];
        }

        const project = resolveProject(identifier);
        return project ? renderProjectDossier(project) : projectNotFound(identifier);
      },
    },
    {
      name: "open",
      description: "request a project route",
      usage: "open <project>",
      execute: ({ args }) => {
        const [identifier] = args;
        if (!identifier) {
          return [{ tone: "error", text: "usage: open <project>" }];
        }

        const project = resolveProject(identifier);
        if (!project) {
          return projectNotFound(identifier);
        }

        onProjectOpenRequest?.(project.id);

        return [
          { tone: "accent", text: `OPEN REQUEST / ${project.title}` },
          {
            tone: "muted",
            text: project.route ?? "route not wired in lab",
          },
        ];
      },
    },
    {
      name: "stack",
      description: "show the working stack",
      execute: () => [
        { tone: "output", text: "Next.js / React / TypeScript" },
        { tone: "output", text: "Three.js / R3F / GLSL" },
        { tone: "output", text: "GSAP / Lenis / Blender / Figma" },
      ],
    },
    {
      name: "clear",
      description: "clear visible output",
      clearsHistory: true,
      execute: () => [],
    },
  ];

  return commands;
}

const initialLines: TerminalLine[] = [
  { id: 0, tone: "accent", text: "PLAYGROUND TERMINAL / 01" },
  { id: 1, tone: "muted", text: "session ready" },
  { id: 2, tone: "muted", text: 'type "help"' },
];

export default function PlaygroundTerminal({
  onProjectOpenRequest,
}: PlaygroundTerminalProps) {
  const terminalDevice = useTerminalDevice();
  const isPowered = terminalDevice?.isPowered ?? true;
  const terminalRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextLineIdRef = useRef(initialLines.length);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState(initialLines);
  const [submittedCommands, setSubmittedCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const commandRegistry = useMemo(
    () => createCommandRegistry(onProjectOpenRequest),
    [onProjectOpenRequest],
  );
  const commandsByName = useMemo(
    () => new Map(commandRegistry.map((command) => [command.name, command])),
    [commandRegistry],
  );

  useEffect(() => {
    const output = outputRef.current;
    if (output) {
      output.scrollTop = output.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!terminalRef.current?.contains(event.target as Node)) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isPowered) {
      inputRef.current?.blur();
    }
  }, [isPowered]);

  const focusInput = useCallback(() => {
    if (isPowered) {
      inputRef.current?.focus();
    }
  }, [isPowered]);

  const appendLines = useCallback((newLines: TerminalOutput[]) => {
    setLines((currentLines) => [
      ...currentLines,
      ...newLines.map((line) => ({
        ...line,
        id: nextLineIdRef.current++,
      })),
    ]);
  }, []);

  const submitCommand = useCallback(() => {
    const rawInput = input;
    const tokens = rawInput.trim().split(/\s+/);
    const [commandName = "", ...args] = tokens;
    if (!commandName) return;

    const normalizedCommandName = commandName.toLowerCase();
    const command = commandsByName.get(normalizedCommandName);

    setSubmittedCommands((currentHistory) => [...currentHistory, rawInput]);
    setHistoryIndex(null);
    setInput("");

    if (command?.clearsHistory) {
      setLines([]);
      return;
    }

    appendLines([
      { tone: "command", text: `${prompt} ${rawInput}` },
      ...(command?.execute({ args, rawInput }) ?? [
        {
          tone: "error",
          text: `command not found: ${normalizedCommandName}`,
        },
      ]),
    ]);
  }, [appendLines, commandsByName, input]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitCommand();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitCommand();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!submittedCommands.length) return;

      const nextIndex = historyIndex === null
        ? submittedCommands.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(submittedCommands[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;

      if (historyIndex >= submittedCommands.length - 1) {
        setHistoryIndex(null);
        setInput("");
        return;
      }

      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setInput(submittedCommands[nextIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  };

  return (
    <section
      ref={terminalRef}
      aria-label="Playground terminal"
      className={styles.terminal}
      data-focused={isFocused || undefined}
      data-powered={isPowered || undefined}
      onPointerDown={focusInput}
    >
      <div className={styles.bezel}>
        <header className={styles.header}>
          <span>LAB TERMINAL / 01</span>
          <span>LOCAL INTERFACE</span>
        </header>

        <div className={styles.screen}>
          <div className={styles.screenLabels} aria-hidden="true">
            <span>ARCHIVE MODE</span>
            <span>STATUS / READY</span>
          </div>

          <div
            ref={outputRef}
            aria-live="polite"
            aria-relevant="additions"
            className={styles.output}
            role="log"
          >
            {lines.map((line) => (
              <p key={line.id} className={styles[`line${line.tone}`]}>
                {line.text}
              </p>
            ))}
          </div>

          <form className={styles.commandLine} onSubmit={handleSubmit}>
            <span aria-hidden="true" className={styles.prompt}>
              {prompt}
            </span>
            <input
              ref={inputRef}
              aria-label="Terminal command input"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              className={styles.input}
              disabled={!isPowered}
              onBlur={() => {
                setIsFocused(false);
                terminalDevice?.setTerminalFocused(false);
              }}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => {
                setIsFocused(true);
                terminalDevice?.setTerminalFocused(true);
              }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              value={input}
            />
          </form>
        </div>

        <footer className={styles.footer}>
          <span>INPUT / KEYBOARD</span>
          <span>EMIR DUMAN</span>
        </footer>
      </div>
    </section>
  );
}
