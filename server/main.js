import { Meteor } from 'meteor/meteor';
import { QUESTIONS } from '../lib/qb.js';
import { SCORES } from '../lib/qb.js';
import { ALLSCORES } from '../lib/qb.js';
import { qs } from './qs.js';

Meteor.startup(() => {


	
		  // code to run on server at startup
		  if (QUESTIONS.find().count() == 0)
		  {
		  		for(var i = 0; i < qs.length; i++)
		  		{
	  				QUESTIONS.insert(qs[i]);
		  		}
		  }
	

});

Meteor.methods({
	'leader_board'(userID, updated_score)	//Updating user's Grand sum of total scores
	{
		var P = ALLSCORES.findOne({user_ID:userID});

		//Grabbing previous Grand Sum of score and adding
		//newest score to it
		var Q = parseInt(P.grand_sum) + updated_score;	

		ALLSCORES.update({"user_ID":userID}, {$set:{grand_sum:Q}});
	}
});