import { writingSlugs } from "#lib/writing.server.js";
import type { EntryGenerator } from "./$types";

export const prerender = "auto";

export const entries: EntryGenerator = async () => (await writingSlugs).map((slug) => ({ slug }));
