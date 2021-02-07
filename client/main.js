import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { QUESTIONS } from '../lib/qb.js';
import { Mongo } from 'meteor/mongo';
import './main.html';

//--------------- Template Helpers ---------------

Template.FORMS.onCreated(function bodyOnCreated() {	
  // counter starts at 0
  this.state = new ReactiveDict();	//Create State when Topic template is created
});


Template.FORMS.helpers({
	//ques: QUESTIONS.find({})

	'ques'()
	{
		const instance = Template.instance();
		var P = instance.state.get('topic_name');
		var Q = instance.state.get('topic_state');

		if(Q && P)
		{
			return QUESTIONS.find({topic:P});
		}

		else
		{
			return QUESTIONS.find({});
		}

	},

});
//=================================================

//--------------- Template Listeners -------------

Template.FORMS.events({	//Listening to Quiz
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

	'change .topics'(e, instance)	//Grabbing Topic name and State
	{
		var A = e.target.name;		//Grabbing Topic Name
		var B = e.target.checked;	//Grabbing Topic State

		instance.state.set('topic_name', A);	//Putting Topic Name in ReactiveDict
		instance.state.set('topic_state', B);	//Putting Topic State in ReactiveDict
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