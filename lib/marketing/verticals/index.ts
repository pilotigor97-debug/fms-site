import { cleaning } from "./cleaning";
import { facilities } from "./facilities";
import { hvac } from "./hvac";
import { landscaping } from "./landscaping";
import { remodeling } from "./remodeling";
import { rental } from "./rental";
import type { VerticalId, VerticalMarketing } from "./types";

// Registry. Adicionar vertical novo = importar + adicionar entry aqui.
// Quando 1 vertical "graduar" pra página estática própria, mantenha
// o config aqui mesmo — a página estática pode importar daqui como
// bloco inicial e adicionar seções extras.
const VERTICALS: Readonly<Record<VerticalId, VerticalMarketing>> = {
  rental,
  cleaning,
  hvac,
  remodeling,
  facilities,
  landscaping,
};

const VERTICAL_IDS = Object.keys(VERTICALS) as VerticalId[];

export function getVertical(id: string): VerticalMarketing | null {
  return (VERTICALS as Record<string, VerticalMarketing>)[id] ?? null;
}

export function getAllVerticalIds(): ReadonlyArray<VerticalId> {
  return VERTICAL_IDS;
}

export type { VerticalId, VerticalMarketing } from "./types";
