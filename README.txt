About Input:

I assume the inputs are three arrays.

The first one (D0-position) is like:
[
  'AAPL 100',
  'GOOG 200',
  'Cash 1000',
    .
    .
    .
]

The second one (D1-TRN) is like:
[
  'AAPL SELL 100 30000',
  'GOOG BUY 10 10000',
   .
   .
   .
   .
]

The third one (D1-position) is like:
[
  'MSFT 10',
  'GOOG 220',
  'Cash 8000',
    .
    .
    .
]


I create a transaction type object to simplify the code:
{
  SELL: {
    cash: 1,
    share: -1
  },
  BUY: {
    cash: -1,
    share: 1
  },
  DEPOSIT: {
    cash: 1,
    share: 0
  },
  FEE: {
    cash: -1,
    share: 0
  },
  DIVIDEND: {
    cash: 1,
    share: 1
  }
}

For example, if we have a new type of transaction, most likely, we do not need to modify our code.
All we need to do is to add another (key, value) pair in this object. Thus, it could reduce the complexity of the code and increase scalability.
Also, since it is an "object", the time cost to find the type we want is constant.


The logic to solve the problem is in three steps:
1. parse D1 position (element by element)
2. Modify position according to D1 transaction and D0 position (element by element)
3. report descripancy


Assume D1-position has N elements
Assume D1-TRN has M elements
Assume D0-position has P elements

Time complexity: O(N + M + P)
Space complexity: O(Smaller than twice of the size of the Collection of N, M and P)
since we need to create an object and then return an array of string.

to see the result of the example.
simpy run "node recon.js"
