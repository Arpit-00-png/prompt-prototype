import { getBalance } from "../../utils/tokenLogic";

export async function handleTokenBalance({ user }) {
  const { balance, escrow } = await getBalance(user.id);
  return {
    status: 200,
    data: { balance, escrow }
  };
}

