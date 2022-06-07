const express = require('express');
const { userDBMethods } = require('db-methods');
const request = require('request');
const { initializePayment, verifyPayment } = require('./helper')(request);

let holder = '';

async function pay(req, res){
   const {contestantNumber} = req.body;
  
   const user = await userDBMethods.getContestant(contestantNumber);
   
   holder = user.contestantNumber;

   if(!user){
       return res.status(404).
       json({message: 'no user found'})
   }

   const details = {
            metadata:{
                name: user.name
            },
        amount: process.env.VOTE_AMOUNT * 100,
        email: user.email
    };

    const callback = (error, body) => {
        if(error){
            console.log(error);
            return;
        };
        response = JSON.parse(body);
        console.log(response.data.authorization_url)
        res.redirect(response.data.authorization_url);
    };

    initializePayment(details, callback);
}

async function countVote(req, res){
    const user = await userDBMethods.getContestant(holder);

    if(!user){
        return res.status(404).
        json({message: 'no user found'})
    }

    const ref = req.query.reference;

    const callback = async (error, body) => {
        if(error){
            console.log(error);
            return;
        };

        response = JSON.parse(body);

        user.numOfVotes += 1;

        await userDBMethods.update(user._id, {...user});

        return res.status(200).json({message: 'successful'});
    }

    verifyPayment(ref, callback);
}

module.exports = { pay, countVote };