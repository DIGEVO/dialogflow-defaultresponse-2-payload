'use strict';

const _ = require('lodash');

const messages = [
	{
		type: 0,
		speech: ['a', 'b']
	}, {
		type: 0,
		speech: 'xxx'
	}, {
		type: 0,
		speech: ['c', 'd']
	}
];

const res = messages.reduce((acc, o) => {
	const speech = [].concat(o.speech);
	const partial = _.flatMap(acc, s1 => {
		return speech.map(s2 => {
			if(s1 && s2) return `${s1} ${s2}`;
			if(s1) return s1;
			return s2;
		})
	});

	return partial;
}, ['']);


console.log(res);