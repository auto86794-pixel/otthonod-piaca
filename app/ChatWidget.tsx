"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sending = useRef(false);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages, open, pending, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending.current || text.length > 1000) return;
    sending.current = true;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setPending(text);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error || "Hiba történt. Próbáld újra.");
      if (typeof result.reply !== "string" || !result.reply.trim())
        throw new Error("Nem érkezett válasz. Próbáld újra.");
      const updated: Msg[] = [
        ...next,
        { role: "assistant", content: result.reply.trim() },
      ];
      setMessages(updated.slice(-60));
    } catch (err) {
      setInput(text);
      setError(
        err instanceof Error && err.name !== "TimeoutError"
          ? err.message
          : "Kapcsolódási hiba. Próbáld újra.",
      );
    } finally {
      setPending("");
      setBusy(false);
      sending.current = false;
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <section
          className="chat-panel"
          id="otthon-chat"
          aria-label="Chat asszisztens"
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
        >
          <header>
            <strong>Otthonod Piaca</strong>
            <span>AI asszisztens · válaszai tájékoztató jellegűek</span>
          </header>
          <div
            className="chat-messages"
            ref={listRef}
            role="log"
            aria-label="Beszélgetés"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.length === 0 && !pending && (
              <p className="msg assistant chat-intro">
                Szia! 👋 Segítek az értékbecsléssel és az eladás folyamatával
                kapcsolatos kérdésekben. Miben segíthetek?
              </p>
            )}
            {messages.map((message, i) => (
              <p key={i} className={`msg ${message.role}`}>
                <span className="sr-only">
                  {message.role === "user" ? "Te: " : "Asszisztens: "}
                </span>
                {message.content}
              </p>
            ))}
            {pending && <p className="msg user">{pending}</p>}
            {busy && <p className="msg assistant typing">Írás…</p>}
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <p className="chat-notice">
            Elérhetőségeidet a{" "}
            <a href="#kapcsolat" onClick={close}>
              Kapcsolat űrlapján
            </a>{" "}
            add meg. Az üzeneteket a Groq dolgozza fel.{" "}
            <a href="/adatkezeles">Adatkezelés</a>
          </p>
          <form onSubmit={send}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Írd ide a kérdésed…"
              maxLength={1000}
              aria-label="Üzenet"
              disabled={busy}
              autoComplete="off"
            />
            <button
              className="button primary"
              type="submit"
              disabled={busy || !input.trim()}
            >
              Küldés
            </button>
          </form>
        </section>
      )}
      <button
        ref={toggleRef}
        className="chat-toggle"
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="otthon-chat"
        aria-label={open ? "Chat bezárása" : "Chat megnyitása"}
      >
        <span aria-hidden="true">{open ? "✕" : "💬"}</span>
      </button>
    </div>
  );
}
