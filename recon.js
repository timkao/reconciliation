
// just to simulate what a simple account structure could be
const account = {
  id: 1,
  username: 'Tim',
  beginOfDayPosition: {
    AAPL: 100,
    GOOG: 200,
    SP500: 175.75,
    Cash: 1000
  },
  currentDayTransactions: [
    {
      targetId: 2,
      target: 'AAPL',
      action: 'SELL',
      share: 100,
      value: 30000
    },
    {
      targetId: 3,
      target: 'GOOG',
      action: 'BUY',
      share: 10,
      value: 10000
    },
    {
      targetId: 1,
      target: 'Cash',
      action: 'DEPOSIT',
      share: 0,
      value: 1000
    },
    {
      targetId: 1,
      target: 'Cash',
      action: 'FEE',
      share: 0,
      value: 50
    },
    {
      targetId: 3,
      target: 'GOOG',
      action: 'DIVIDEND',
      share: 0,
      value: 50
    },
    {
      targetId: 4,
      target: 'TD',
      action: 'BUY',
      share: 100,
      value: 10000
    },
  ],
  endOfDayPosition: {
    GOOG: 220,
    SP500: 175.75,
    Cash: 20000,
    MSFT: 10
  }
};

// prepare data for the test
const generatePositionRecord = function(beginPosition) {
  return Object.keys(beginPosition).map(target => {
    return `${target} ${beginPosition[target]}`;
  })
}

const generateTranscationRecord = function(transactions) {
  return transactions.map(trn => {
    return `${trn.target} ${trn.action} ${trn.share} ${trn.value}`
  })
}

const exD0Position = generatePositionRecord(account.beginOfDayPosition);
const exTransactions = generateTranscationRecord(account.currentDayTransactions);
const exD1Position = generatePositionRecord(account.endOfDayPosition);

// check the example input data in the console
console.log('');
console.log('-------Input Data----------');
console.log(exD0Position);
console.log(exTransactions);
console.log(exD1Position);
console.log('---------------------------');

// helper function to parse the positions and transaction strings
const parseTrnStr = function(str) {
  const tempArr = str.split(' ');
  if (tempArr.length === 2) {
    return {
      target: tempArr[0],
      volume: Number(tempArr[1])
    }
  } else if (tempArr.length === 4) {
    return {
      target: tempArr[0],
      type: tempArr[1],
      shareVolume: Number(tempArr[2]),
      cashVolume: Number(tempArr[3])
    }
  }
}

/*
  Define transaction type.
  This allows us to add new transaction types easily without re-writing our solution
  1. Assume we cannot "pay fee" or "add deposit" with share.
  2. Every transaction could have effect on cash or share in this case.
  3. Three types of Effect: increase (1), decrease (-1), none (0)
*/
const transactionType = {
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

// SOLUTION
const recon = function(d0position, transactions, d1position) {
  const result = {};

  // Assume the position will always have "Cash" even if the cash is zero
  // start from the end of day position
  d1position.forEach(pos => {
    const { target, volume } = parseTrnStr(pos);
    result[target] = volume;
  })

  // deduct whatever d0 has
  d0position.forEach(pos => {
    const { target, volume } = parseTrnStr(pos);

    if (result[target] === undefined) {
      result[target] = -volume
    } else {
      result[target] -= volume;
    }
  })

  // deduct whatever increased due to transaction to get the discrepancy
  transactions.forEach(transaction => {
    const { target, type, shareVolume, cashVolume } = parseTrnStr(transaction);

    if (result[target] === undefined) {
      result[target] = -transactionType[type].share * shareVolume;
      result.Cash -= transactionType[type].cash * cashVolume
    } else if (target === 'Cash') {
      result.Cash -= transactionType[type].cash * cashVolume
    } else {
      result[target] -= transactionType[type].share * shareVolume;
      result.Cash -= transactionType[type].cash * cashVolume
    }
  })

  // only the non-zero discrepancy should be reported
  const returnedResult = [];
  Object.keys(result).forEach(pos => {
    if (result[pos] !== 0) {
      returnedResult.push(`${pos} ${result[pos]}`);
    }
  })
  return returnedResult;
}

// log out the result
console.log('');
console.log('--------Result----------');
console.log(recon(exD0Position, exTransactions, exD1Position));
console.log('');
