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
