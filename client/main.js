import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { QUESTIONS } from '../lib/qb.js';
import { Mongo } from 'meteor/mongo';
import './main.html';

//--------------- Template Helpers ---------------

Template.FORMS.onCreated(function bodyOnCreated() {	
  
  this.state = new ReactiveDict();	//Create State when Topic template is created
});


Template.FORMS.helpers({
	'ques'()	//Rendering Questions from database
	{
		const instance = Template.instance();	//Calling the Reactive Dict
		var A = instance.state.get('topics');	//Grabbing topic from Reactive Dict
		
		if(A && A.length != 0)	//If user select topic(s) then...
		{
			B = [];	
			
			for(var i = 0; i<A.length; i++)
			{
				obj = {};
				obj['topic'] = A[i].value;	//Making chosen topic(s) object
				B.push(obj);				//Pushing it into array

			}
		
			//console.log(B);
			return QUESTIONS.find({$or:B});
		}
		

	},

	'result'()	//Rendering result after submitting answers
	{
		const instance = Template.instance();		//Calling the Reactive Dict
		var right = instance.state.get('rights');	//Number of Right answers
		var wrong = instance.state.get('wrongs');	//Number of Wrong answers

		if(right || wrong)	//If answered right or wrong
		{
			return " Correct: " + right + "  Wrong: " + wrong;
		}

		else
		{
			return "Submit your answers to see result";
		}
	},

	'correct_ans'()	//Rendering Correct answers corresponds to wrong answers
	{
		const instance = Template.instance();	//Calling the Reactive Dict

		var P;
		P = instance.state.get('correct_ans');	//Grabbing the Corrected answers

		if(P && P.length != 0)	//If any Corrected answers for wrong answer remains
		{
			B = []
			for(var i = 0; i<P.length; i++)
				{
					obj = {};
					obj['correct'] = P[i];		//Making corrected answers object
					B.push(obj);				//Pushing it into array

				}
			return B;
		}
	},




});
//=================================================

//--------------- Template Listeners -------------

Template.FORMS.events({	//Listening to Quiz
	'submit .infos'(e, instance)
	{
		e.preventDefault();

		//Putting all submitted answers in an array
		var P = $(".infos").serializeArray();
		
		var right = 0;
		var wrong = 0;

		correct_answer = []
		//Iterating through submitted answers
		for(var i = 0; i<P.length; i++)
		{
			
			var Q = QUESTIONS.findOne({_id:P[i].name});	//Grabbing Question set from db

			//Comparing Submitted answers with db Question set
			if(P[i].value == Q.ans)	
			{
				right = right + 1;	//Counting Right answers
			}
			else
			{
				//Correct answers to corresponding right answers
				//along with indexing
				correct_answer.push(" (" + i + ") " + Q.ans);

				wrong = wrong + 1;	//Counting Wrong answers
			}

			//Putting counts in Reactive Dicts
			instance.state.set('rights', right);
			instance.state.set('wrongs', wrong);

		}
		
		//Putting correct answers in Reactive Dicts
		instance.state.set('correct_ans', correct_answer);

		if(P)
		{
		}
		
	},

	'change .topics'(e, instance)	//Grabbing Topic name
	{
		var A = $('.topics').serializeArray()	//Grabbing selected Topic name
		instance.state.set('topics',A);			//Pushing it to Reactive Dict

		if(A && A.length != 0)
		{
			$('#submitting_button').css('display','block');
			$('#instruct').css('display','none');
		}
		else
		{
			$('#submitting_button').css('display','none');
			$('#instruct').css('display','block');
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