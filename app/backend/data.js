// XXX: This should be a database of users :).
var users = [{
    id: 1,
    username: 'gonto',
    password: 'gonto',
    email: 'gonto@gmail.com',
    balance: 400
},{
    id: 2,
    username: 'slimmy',
    password: 'slimmy',
    email: 'slimmy@gmail.com',
    balance: 600
}
];
var transactions = [{
    id: 1,
    user_id: 1,
    date: '2016-06-10 07:45:00',
    corr_user_id: 2,
    amount: -100,
    balance: 400
},{
    id: 2,
    user_id: 2,
    date: '2016-06-10 07:45:00',
    corr_user_id: 1,
    amount: 100,
    balance: 600
}
];

exports.getUsers = function() {
    return users;
}

exports.getTransactions = function() {
    return transactions;
}