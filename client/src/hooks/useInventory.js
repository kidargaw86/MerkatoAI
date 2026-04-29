import { useEffect, useState } from "react";

export default function useInventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([]);
  }, []);

  return { items };
}
