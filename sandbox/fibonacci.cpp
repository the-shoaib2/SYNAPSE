
#include <iostream>
#include <vector>

using namespace std;

int fibonacci(int n) {
  // Create a vector to store Fibonacci numbers
  vector<int> fib(n + 1);

  // Base cases
  fib[0] = 0;
  if (n > 0) {
    fib[1] = 1;
  }

  // Fill the vector using dynamic programming
  for (int i = 2; i <= n; ++i) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }

  // Return the nth Fibonacci number
  return fib[n];
}

int main() {
  int n;
  cout << "Enter the value of n: ";
  cin >> n;

  cout << "Fibonacci(" << n << ") = " << fibonacci(n) << endl;

  return 0;
}
