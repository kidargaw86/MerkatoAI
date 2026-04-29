export class Inventory {
  constructor({ id, itemName, unitPrice, quantity, teraLocation, shopNumber, wholesalerId, isAvailable = true }) {
    this.id = id;
    this.itemName = itemName;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
    this.teraLocation = teraLocation;
    this.shopNumber = shopNumber;
    this.wholesalerId = wholesalerId;
    this.isAvailable = isAvailable;
  }

  isInBudget(maxPrice) {
    return this.unitPrice <= maxPrice;
  }

  hasSufficientQuantity(requestedQty) {
    return this.quantity >= requestedQty;
  }
}