const paystack = (request) => {
    const MySecretKey = process.env.TEST_SECRET_KEY;

    const initializePayment = (form, myCallback) => {
        const option = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                Authorization: `Bearer ${MySecretKey}`,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            form
        }

        const callback = (error, response, body) => {
            return myCallback(error, body);
        }

        request.post(option, callback);
    }

    const verifyPayment = (ref, myCallback) => {
        const option = {
            url: 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref),
            headers: {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        }

        const callback = (error, response, body) => {
            return myCallback(error, body);
        }

        request(option, callback);
    }

    return { initializePayment, verifyPayment};

}

module.exports = paystack;