export interface Tip {
  id: string;
  category:
    | "stress"
    | "coffee"
    | "boredom"
    | "social"
    | "other"
    | "general"
    | "motivation";
  text: string;
}
