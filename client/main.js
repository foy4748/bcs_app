import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { QUESTIONS } from '../lib/qb.js';
import { Mongo } from 'meteor/mongo';
import './main.html';

//--------------- Template Helpers ---------------
Template.FORMS.helpers({ques: QUESTIONS.find({})});
//=================================================

//--------------- Template Listeners -------------
Template.FORMS.events({
	'submit .infos'(e)
	{
		e.preventDefault();

		//Putting all submitted answers in an array
		var P = $(".infos").serializeArray();
		
		//Iterating through submitted answers
		for(var i = 0; i<P.length; i++)
		{
			
			var Q = QUESTIONS.findOne({_id:P[i].name});	//Grabbing Question set from db

			//Comparing Submitted answers with db Question set
			if(P[i].value == Q.ans)	
				console.log("Right answer");
			else
				console.log("Sorry, Wrong answer");

		}
		

	},
});
//============== End of Template Listeners =========

//------------------------------------------------------
//Example code provided by default.
//Good example of Reactive variable!!!
/*Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});*/
//------------------------------------------------------