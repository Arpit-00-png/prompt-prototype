import { mintTokens } from "../../utils/tokenLogic";

export async function handleMintTokens({ user, body }) {
  const hours = Number(body?.hours);
  if (!hours || hours <= 0) {
    throw new Error("Hours must be greater than zero");
  }
  if (body?.userId && body.userId !== user.id) {
    throw new Error("Cannot mint tokens for another user");
  }
  const amount = await mintTokens(user.id, hours);
  return {
    status: 201,
    data: { amount, message: "Tokens minted" }
  };
}

