import axios from "axios";

export const fetchPrices = async () => {
  try {
    const response = await axios.get("https://interview.switcheo.com/prices.json");
    // Lọc các loại tiền có giá trị price hợp lệ
    const prices = response.data.filter(item => item.price);
    return prices;
  } catch (error) {
    console.error("Error fetching prices:", error);
    return [];
  }
};
