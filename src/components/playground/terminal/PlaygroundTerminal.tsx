"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./PlaygroundTerminal.module.css";

type TerminalLineTone = "accent" | "command" | "error" | "muted" | "output";

type TerminalLine = {
  id: number;
  text: string;
  tone: TerminalLineTone;
};

type TerminalOutput = Omit<TerminalLine, "id">;

type TerminalCommand = {
  description: string;
  execute: () => TerminalOutput[];
  name: string;
  clearsHistory?: boolean;
};

const prompt = "emir@playground:~ $";

const commandRegistry: readonly TerminalCommand[] = [
  {
    name: "help",
    description: "list available commands",
    execute: () => [
      { tone: "accent", text: "AVAILABLE COMMANDS" },
      ...commandRegistry.map(({ name, description }) => ({
        tone: "output" as const,
        text: `${name.padEnd(10)}${description}`,
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
    description: "show selected experiments",
    execute: () => [
      { tone: "accent", text: "SELECTED EXPERIMENTS" },
      { tone: "output", text: "BOARDING PASS  / tactile unlock surface" },
      { tone: "output", text: "PLAYGROUND CAN / material study" },
      { tone: "output", text: "INTERACTION LAB / objects in progress" },
    ],
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
    description: "clear terminal history",
    clearsHistory: true,
    execute: () => [],
  },
] as const;

const commandsByName = new Map(commandRegistry.map((command) => [command.name, command]));

const initialLines: TerminalLine[] = [
  { id: 0, tone: "accent", text: "PLAYGROUND TERMINAL / 01" },
  { id: 1, tone: "muted", text: "session ready" },
  { id: 2, tone: "muted", text: 'type "help"' },
];

export default function PlaygroundTerminal() {
  const terminalRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextLineIdRef = useRef(initialLines.length);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState(initialLines);
  const [submittedCommands, setSubmittedCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

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
    const value = input.trim();
    if (!value) return;

    const [commandName] = value.toLowerCase().split(/\s+/, 1);
    const command = commandsByName.get(commandName);

    setSubmittedCommands((currentHistory) => [...currentHistory, value]);
    setHistoryIndex(null);
    setInput("");

    if (command?.clearsHistory) {
      setLines([]);
      return;
    }

    appendLines([
      { tone: "command", text: `${prompt} ${value}` },
      ...(command?.execute() ?? [
        { tone: "error", text: `command not found: ${commandName}` },
      ]),
    ]);
  }, [appendLines, input]);

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
      onPointerDown={focusInput}
    >
      <div aria-hidden="true" className={styles.cornerMark} />
      <div aria-hidden="true" className={styles.statusLed} />
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
              onBlur={() => setIsFocused(false)}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => setIsFocused(true)}
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
