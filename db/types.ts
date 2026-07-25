export type Bucket = "necessidades" | "estilo_vida" | "investimentos" | "outros";
export type TransactionType = "income" | "expense";
export type AccountType = "corrente" | "poupanca" | "cartao" | "dinheiro";

export type Account = {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  icon: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
  bucket: Bucket;
};

export type Transaction = {
  id: number;
  account_id: number;
  category_id: number | null;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
};

export type Budget = {
  id: number;
  category_id: number;
  month: string;
  limit_amount: number;
};

export type Goal = {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string;
  color: string;
  image_uri: string | null;
};

export type Investment = {
  id: number;
  name: string;
  type: string;
  invested_amount: number;
  current_amount: number;
  date: string;
};

export type SettingsMap = {
  theme: "clarity" | "pulse" | "story";
  currency: string;
  user_name: string;
  avatar_uri: string;
};
