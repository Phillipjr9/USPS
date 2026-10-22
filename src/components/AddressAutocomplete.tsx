import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import {
  addressSuggestions,
  postOfficeSuggestions,
  resolveSuggestion,
  type AddressSuggestion,
} from "../lib/addressSuggest";

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Fires when the customer picks a suggestion; fills city/state/ZIP. */
  onPick: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  invalid?: boolean;
  id?: string;
}

/**
 * Street-address combobox.
 *
 * Post Office matches appear immediately from the bundled locations data; a
 * debounced request to our proxy adds street-level addresses. Fully keyboard
 * operable (arrows, Enter, Escape) and safe to ignore — typing a full address
 * by hand still works exactly as before.
 */
export default function AddressAutocomplete({
  value,
  onChange,
  onPick,
  placeholder = "123 Main Street, Apt 4B",
  invalid,
  id,
}: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<AddressSuggestion[]>([]);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<{ abort: AbortController | null }>({ abort: null });

  // Fetch suggestions shortly after typing stops.
  useEffect(() => {
    if (!open) return;
    const q = value.trim();
    if (q.length < 4) {
      setOptions(postOfficeSuggestions(q));
      return;
    }

    const local = postOfficeSuggestions(q);
    setOptions(local);

    const timer = setTimeout(async () => {
      reqRef.current.abort?.abort();
      const controller = new AbortController();
      reqRef.current.abort = controller;
      setLoading(true);
      const remote = await addressSuggestions(q, controller.signal);
      setLoading(false);
      if (controller.signal.aborted) return;
      // De-dupe: a Post Office address may also come back from the geocoder.
      const seen = new Set(local.map((l) => `${l.street}|${l.zip}`));
      const merged = [...local, ...remote.filter((r) => !seen.has(`${r.street}|${r.zip}`))];
      setOptions(merged.slice(0, 7));
      setActive(-1);
    }, 420);

    return () => clearTimeout(timer);
  }, [value, open]);

  // Close the list when focus leaves the combobox.
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const choose = async (s: AddressSuggestion) => {
    setOpen(false);
    setActive(-1);
    const resolved = await resolveSuggestion(s);
    onPick(resolved);
    onChange(resolved.street || resolved.label);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && active >= 0) {
      e.preventDefault();
      void choose(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const showList = open && (options.length > 0 || loading);

  return (
    <div ref={boxRef} className="relative">
      <input
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        className={`mt-1 w-full border-2 rounded-md px-4 py-3 text-sm outline-none transition-colors ${
          invalid ? "border-red-400 bg-red-50" : "border-slate-300 focus:border-usps-blue"
        }`}
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl"
        >
          {options.map((o, i) => (
            <li key={o.id} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => void choose(o)}
                onMouseEnter={() => setActive(i)}
                className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 border-b border-slate-50 last:border-0 ${
                  i === active ? "bg-usps-light" : "hover:bg-slate-50"
                }`}
              >
                <MapPin
                  className={`h-4 w-4 mt-0.5 shrink-0 ${o.source === "post-office" ? "text-usps-red" : "text-usps-blue"}`}
                />
                <span className="min-w-0">
                  <span className="block text-[13px] text-slate-800 truncate">{o.label}</span>
                  <span className="block text-[11px] text-slate-400">
                    {o.source === "post-office" ? "Post Office™" : "Street address"}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {loading && (
            <li className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Looking up addresses…
            </li>
          )}
          {!loading && options.length === 0 && value.trim().length >= 3 && (
            <li className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-slate-400">
              <Search className="h-3.5 w-3.5" /> No matches — enter the address manually.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
