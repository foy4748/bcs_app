import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { QUESTIONS } from '../lib/qb.js';
import { Mongo } from 'meteor/mongo';
import './main.html';

Template.FORMS.helpers({ques: QUESTIONS.find({})});

Template.FORMS.events({
	'submit .infos'(e)
	{
		e.preventDefault();
		var P = $(".infos").serializeArray();
		
		for(var i = 0; i<P.length; i++)
		{
			console.log(P[i].value);
		}

	},
});
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