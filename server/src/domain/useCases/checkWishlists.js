export async function checkWishlists({ wishlistRepo }) {
  return wishlistRepo.listActive();
}
