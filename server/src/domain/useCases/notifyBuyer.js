export async function notifyBuyer({ messagingService }, message) {
  return messagingService.sendMessage(message);
}
