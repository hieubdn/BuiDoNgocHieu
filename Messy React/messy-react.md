# Sử dụng useMemo không cần thiết hoặc sai cách

`useMemo` được sử dụng để tính toán lại `sortedBalances` khi `balances` hoặc `prices` thay đổi, nhưng `prices` không được sử dụng trực tiếp trong logic `filter` hoặc `sort` làm cho việc theo dõi sự phụ thuộc bị dư thừa, gây tốn hiệu suất.

```
// Cập nhật mới như sau:
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => balance.amount > 0)
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority; // Tối ưu hóa phép so sánh
    });
}, [balances]);
```
**Vấn đề trong code cũ:**
- `prices` không cần nằm trong danh sách phụ thuộc của `useMemo`.
- Sử dụng biến không xác định `lhsPriority` dẫn đến lỗi cú pháp.
  
**Hiệu quả của code mới:**
- Loại bỏ phụ thuộc không cần thiết (`prices`) giảm tần suất tính toán lại `sortedBalances`.
- Sửa lỗi logic trong `filter` và đơn giản hóa phép so sánh trong `sort`.

# Hàm getPriority sử dụng kiểu any
Không nên sử dụng kiểu `any` cho `blockchain` vì không đảm bảo được tính đúng đắn của kiểu dữ liệu. `switch-case` có thể được thay thế bằng cấu trúc dữ liệu như `Map` hoặc `Record` để tăng hiệu suất.

```
// Code mới cập nhật như sau:
const blockchainPriority: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => {
  return blockchainPriority[blockchain] ?? -99;
};
```
**Vấn đề trong code cũ:**
- `any` không đảm bảo tính rõ ràng và dễ gây lỗi.
- `switch-case` ít hiệu quả hơn so với việc truy xuất từ một cấu trúc dữ liệu.

**Hiệu quả của code mới:**
- Sử dụng `Record` tăng hiệu suất truy xuất.
- Hạn chế lỗi sai kiểu dữ liệu nhờ sử dụng kiểu `string` cụ thể.

# Xử lý dữ liệu lặp lại không cần thiết nhiều lần
`sortedBalances` và `formattedBalances` đều duyệt qua danh sách `balances` gây lãng phí tài nguyên. Thay vào đó ta có thể gộp việc sắp xếp và định dạng dữ liệu thành một bước duy nhất.

```
// Cớ mới được cập nhật như sau
const processedBalances = useMemo(() => {
  return balances
    .filter((balance) => balance.amount > 0 && blockchainPriority[balance.blockchain] !== undefined)
    .map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
      usdValue: (prices[balance.currency] || 0) * balance.amount,
      priority: blockchainPriority[balance.blockchain] ?? -99,
    }))
    .sort((a, b) => b.priority - a.priority);
}, [balances, prices]);

const rows = processedBalances.map((balance) => (
  <WalletRow
    key={balance.currency} // Sử dụng `currency` làm key duy nhất
    amount={balance.amount}
    usdValue={balance.usdValue}
    formattedAmount={balance.formatted}
  />
));
```

**Vấn đề trong code cũ:**
- Hai lần duyệt qua danh sách `balances` (`sortedBalances` và `formattedBalances`).
- Sử dụng `key={index}` dễ dẫn đến lỗi nếu thứ tự danh sách thay đổi.

**Hiệu quả của code mới:**
- Gộp xử lý sắp xếp, định dạng, và tính toán giá trị USD vào một bước duy nhất (`processedBalances`).
- Sử dụng `currency` làm `key` đảm bảo tính duy nhất và ổn định.

# Điều kiện lọc không rõ ràng
Logic lọc trong `filter` khá khó hiểu và không đúng mục đích. Cần xác định rõ ràng điều kiện lọc để dễ bảo trì và tăng tính chính xác.
```
// Code mới được cập nhật như sau
balances.filter((balance) => 
  balance.amount > 0 && blockchainPriority[balance.blockchain] !== undefined
);
```

**Vấn đề trong code cũ:**
- Logic lọc phức tạp và sử dụng biến không xác định (`lhsPriority`).

**Hiệu quả của code mới:**

Sử dụng điều kiện lọc rõ ràng và đơn giản hơn:
- `balance.amount > 0`: Chỉ giữ các số dư dương.
- `blockchainPriority[balance.blockchain] !== undefined`: Loại bỏ các `blockchain` không hợp lệ.
