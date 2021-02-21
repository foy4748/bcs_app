import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';

import { QUESTIONS } from '../lib/qb.js';
import { SCORES } from '../lib/qb.js';
import { ALLSCORES } from '../lib/qb.js';

import './main.html';
import './nav.html';
import './leaderboard.html'
import './profile.html'

import './router.js';
import './account.js';
//--------------- Template Helpers ---------------

Template.FORMS.onCreated(function bodyOnCreated() {	
  
  this.state = new ReactiveDict();	//Create State when Topic template is created
});

//Starting Index from 1
Template.registerHelper('count1', function(count) { return count + 1; });

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
	
	'USER_NAME'()	//Rendering USER NAME at Home page
	{
		if(Meteor.userId())
		{
			var B = Meteor.userId();
			var A = Meteor.user({_id:B}).profile.first_name;
			return A;
		}
		else
		{
			return "";
		}
	},

});

Template.profile.helpers({

	'USER_NAME'()	//Rendering USER NAME at Profile page
	{
		if(Meteor.userId())
		{
			var A = Meteor.userId();
			var B = Meteor.user({_id:A}).profile.first_name;
			var C = Meteor.user({_id:A}).profile.last_name;
			return B + ' ' + C;
		}
		else
		{
			return "";
		}
	},

	'user_scores'()
	{
		if(Meteor.userId())
		{
			var A = Meteor.userId();
			return SCORES.find({user_ID:A}, {sort:{createdAt: -1}});
		}
	},

	'attempts'()
	{
		if(Meteor.userId())
		{
			var A = Meteor.userId();
			return SCORES.find({user_ID:A}).count();
		}
	},

	'grand_sum'()
	{
		if(Meteor.userId())
		{
			var A = Meteor.userId();
			return ALLSCORES.findOne({user_ID:A}).grand_sum;
		}
	},

	'avg'()
	{
		if(Meteor.userId())
		{
			var A = Meteor.userId();
			var count = SCORES.find({user_ID:A}).count();
			var grand_sum = ALLSCORES.findOne({user_ID:A}).grand_sum;

			return grand_sum/count;
		}
	}

});



 Template.leaderboard.helpers({
	
	'lead'()
	{
		var P = ALLSCORES.find({}).count();

		if(P != 0)
		{
			var A = ALLSCORES.find({},{sort:{grand_sum:-1}});
			array = A.fetch();
			collect_array = [];
			for(var i=0; i<array.length; i++)
			{
				var P = array[i].user_ID;
				var Name_ = Meteor.users.findOne({_id:P});
				var Z = Name_.profile.first_name + " " + Name_.profile.last_name;
				var Q = array[i].grand_sum;
				var obj = {"Name":Z, "Score":Q};
				
				collect_array.push(obj);
			}
			
			return collect_array;
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
		if(Meteor.userId())		//If user is logged in
		{
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
					//along with index starting from 1
					var p = i + 1;
					correct_answer.push(" (" + p + ") " + Q.ans);

					wrong = wrong + 1;	//Counting Wrong answers
				}

				//Putting counts in Reactive Dicts
				instance.state.set('rights', right);
				instance.state.set('wrongs', wrong);

			}
			
			//Putting correct answers in Reactive Dicts
			instance.state.set('correct_ans', correct_answer);
			
			

			//Calculating total score per submission
			var total_score = right*10 + (-5)*wrong;
			
			
				//Making Score info Object
				var score_info = {
					"user_ID": Meteor.userId(),
					"Right": right,
					"Wrong": wrong,
					"Total_Score": total_score,
					"createdAt": new Date(),
				}

				//Storing the Score info object into db
				SCORES.insert(score_info);

				//Going to the bottom of the page to see result
				$("html, body").animate({ 
					scrollTop: $( 
					'html, body').get(0).scrollHeight 
				}, 1000);

				if(!ALLSCORES.findOne({"user_ID":Meteor.userId()}))
				{
					var leaderboard_score = {
						"user_ID": Meteor.userId(),
						"grand_sum": total_score,
					}

					ALLSCORES.insert(leaderboard_score);
				}

				else
				{
					var A = Meteor.userId();
					Meteor.call('leader_board', A, total_score);
				}
				
		}

		else
		{
			alert('Please, log in');	//Alert if user is not logged in

			//Scroll to the top navigating to the Sign In button
			$("html, body").animate({ scrollTop: 0 }, "slow");
			
			//window.scrollTo(0, 0);	//(xCordinate, yCordinate)
		}

	},

	'change .topics'(e, instance)	//Grabbing Topic name
	{
		var A = $('.topics').serializeArray()	//Grabbing selected Topic name
		instance.state.set('topics',A);			//Pushing it to Reactive Dict

		if(A && A.length != 0)	//If any topic selected
		{
			$('#submitting_button').css('display','block');	//Submit button will appear
			$('#instruct').css('display','none');			//Intrction for selecting topic will disappear
		}
		else
		{
			$('#submitting_button').css('display','none');	//Submit button will be disappeared.
			$('#instruct').css('display','block');			//Intrction for selecting topic will appear
		}

	},

});

Template.navigation_bar.events({	//Listening to Navbar

	'click .Nav_item': function(e)	//Navigation indicator
	{
		$(".Nav_item").css("background", "#00000000");	//Clear Indication
		$(".Nav_item").css("color", "#777");			//Clear Indication
		e.target.style.background = '#219cb2';			//Indicate clicked nav
		e.target.style.color = '#FFFFFF';				//Indicate clicked nav

	}
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