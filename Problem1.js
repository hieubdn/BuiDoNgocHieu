//Cách 1: Sử dụng hàm đệ quy đuôi
var sum_to_n_e = function(n, accumulator = 0) {
    if (n === 0) return accumulator;
    return sum_to_n_e(n - 1, accumulator + n);
};


// Cách 2: Sử dụng vòng lặp for
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Cách 3: Sử dụng công thức toán học
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};