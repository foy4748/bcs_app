import { Mongo } from 'meteor/mongo';

export const QUESTIONS = new Mongo.Collection('questions');
export const SCORES = new Mongo.Collection('scores');
export const ALLSCORES = new Mongo.Collection('allscores');