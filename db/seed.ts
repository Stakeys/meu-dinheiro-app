import { format, subMonths } from "date-fns";
import { db } from "./client";
import { createAccount, recalculateAccountBalance } from "./repositories/accounts";
import { upsertBudget } from "./repositories/budgets";
import { createCategory } from "./repositories/categories";
import { createGoal } from "./repositories/goals";
import { createInvestment } from "./repositories/investments";
import { setSetting } from "./repositories/settings";
import { createTransaction } from "./repositories/transactions";

const TABLES = ["transactions", "budgets", "goals", "investments", "categories", "accounts"];

export function clearAllData(): void {
  db.withTransactionSync(() => {
    for (const table of TABLES) {
      db.execSync(`DELETE FROM ${table};`);
    }
  });
}

function monthStr(offset: number) {
  return format(subMonths(new Date(), offset), "yyyy-MM");
}

function dateStr(offset: number, day: number) {
  const target = subMonths(new Date(), offset);
  const clampedDay = Math.min(day, 28);
  return `${format(target, "yyyy-MM")}-${String(clampedDay).padStart(2, "0")}`;
}

export function seedDemoData(): void {
  clearAllData();

  db.withTransactionSync(() => {
    const contaCorrente = createAccount({
      name: "Conta Corrente",
      type: "corrente",
      balance: 0,
      color: "#7C3AED",
      icon: "wallet",
    });
    const cartao = createAccount({
      name: "Cartão de Crédito",
      type: "cartao",
      balance: 0,
      color: "#EC4899",
      icon: "card",
    });

    const categorias = {
      moradia: createCategory({ name: "Moradia", icon: "home", color: "#FBBF24", bucket: "necessidades" }),
      alimentacao: createCategory({
        name: "Alimentação",
        icon: "fast-food",
        color: "#F43F5E",
        bucket: "necessidades",
      }),
      transporte: createCategory({ name: "Transporte", icon: "car", color: "#3B82F6", bucket: "necessidades" }),
      saude: createCategory({ name: "Saúde", icon: "medkit", color: "#10B981", bucket: "necessidades" }),
      lazer: createCategory({ name: "Lazer", icon: "game-controller", color: "#8B5CF6", bucket: "estilo_vida" }),
      assinaturas: createCategory({
        name: "Assinaturas",
        icon: "repeat",
        color: "#F472B6",
        bucket: "estilo_vida",
      }),
      investimentos: createCategory({
        name: "Investimentos",
        icon: "trending-up",
        color: "#14B8A6",
        bucket: "investimentos",
      }),
      outros: createCategory({ name: "Outros", icon: "ellipsis-horizontal", color: "#94A3B8", bucket: "outros" }),
      salario: createCategory({ name: "Salário", icon: "cash", color: "#22C55E", bucket: "outros" }),
    };

    const thisMonthTransactions: Array<{
      account: number;
      category: number;
      type: "income" | "expense";
      amount: number;
      description: string;
      day: number;
    }> = [
      { account: contaCorrente.id, category: categorias.salario.id, type: "income", amount: 4850, description: "Salário", day: 1 },
      { account: contaCorrente.id, category: categorias.salario.id, type: "income", amount: 1200, description: "Freelance", day: 10 },
      { account: contaCorrente.id, category: categorias.moradia.id, type: "expense", amount: 1800, description: "Aluguel", day: 5 },
      { account: contaCorrente.id, category: categorias.alimentacao.id, type: "expense", amount: 450, description: "Supermercado", day: 3 },
      { account: cartao.id, category: categorias.alimentacao.id, type: "expense", amount: 189.9, description: "Supermercado Extra", day: 25 },
      { account: cartao.id, category: categorias.transporte.id, type: "expense", amount: 24.5, description: "Uber", day: 24 },
      { account: contaCorrente.id, category: categorias.transporte.id, type: "expense", amount: 220, description: "Combustível", day: 12 },
      { account: contaCorrente.id, category: categorias.saude.id, type: "expense", amount: 350, description: "Plano de saúde", day: 8 },
      { account: cartao.id, category: categorias.lazer.id, type: "expense", amount: 80, description: "Cinema", day: 18 },
      { account: cartao.id, category: categorias.assinaturas.id, type: "expense", amount: 55.9, description: "Netflix", day: 3 },
      { account: cartao.id, category: categorias.assinaturas.id, type: "expense", amount: 21.9, description: "Spotify", day: 3 },
      { account: cartao.id, category: categorias.assinaturas.id, type: "expense", amount: 12, description: "iCloud", day: 5 },
      { account: contaCorrente.id, category: categorias.outros.id, type: "expense", amount: 150, description: "Presente", day: 20 },
      { account: contaCorrente.id, category: categorias.investimentos.id, type: "expense", amount: 2000, description: "Aporte mensal", day: 6 },
    ];

    for (const t of thisMonthTransactions) {
      createTransaction({
        account_id: t.account,
        category_id: t.category,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: dateStr(0, t.day),
      });
    }

    // Cada mês histórico recebe receita e despesa para o saldo acumulado das contas ficar realista.
    const historicoDespesas = [4200, 4500, 5100, 6200, 6800];
    historicoDespesas.forEach((valor, index) => {
      const offset = historicoDespesas.length - index;
      createTransaction({
        account_id: contaCorrente.id,
        category_id: categorias.salario.id,
        type: "income",
        amount: 6050,
        description: "Salário",
        date: dateStr(offset, 1),
      });
      createTransaction({
        account_id: contaCorrente.id,
        category_id: categorias.outros.id,
        type: "expense",
        amount: valor,
        description: `Despesas de ${monthStr(offset)}`,
        date: dateStr(offset, 15),
      });
    });

    recalculateAccountBalance(contaCorrente.id);
    recalculateAccountBalance(cartao.id);

    createGoal({
      name: "Viagem para Bali",
      target_amount: 5000,
      current_amount: 3900,
      deadline: null,
      icon: "airplane",
      color: "#F472B6",
      image_uri: null,
    });
    createGoal({
      name: "Entrada do Apê",
      target_amount: 30000,
      current_amount: 13500,
      deadline: null,
      icon: "home",
      color: "#FBBF24",
      image_uri: null,
    });
    createGoal({
      name: "Reserva de Emergência",
      target_amount: 10000,
      current_amount: 6200,
      deadline: null,
      icon: "shield-checkmark",
      color: "#10B981",
      image_uri: null,
    });

    createInvestment({
      name: "Tesouro Selic",
      type: "renda_fixa",
      invested_amount: 5000,
      current_amount: 5320,
      date: dateStr(6, 10),
    });
    createInvestment({
      name: "Ações XPTO",
      type: "renda_variavel",
      invested_amount: 3000,
      current_amount: 2850,
      date: dateStr(4, 5),
    });
    createInvestment({
      name: "Fundo Imobiliário",
      type: "fundos",
      invested_amount: 2000,
      current_amount: 2110,
      date: dateStr(5, 20),
    });

    const currentMonth = monthStr(0);
    upsertBudget({ category_id: categorias.alimentacao.id, month: currentMonth, limit_amount: 500 });
    upsertBudget({ category_id: categorias.lazer.id, month: currentMonth, limit_amount: 150 });
    upsertBudget({ category_id: categorias.moradia.id, month: currentMonth, limit_amount: 2000 });
    upsertBudget({ category_id: categorias.transporte.id, month: currentMonth, limit_amount: 300 });

    setSetting("user_name", "Stanley");
    setSetting("currency", "BRL");
  });
}
