export type AgentState = {
  input: string;
  intent?: string;
  products?: any[];
  product?: any;
  docs?: any[];
  answer?: string;
};