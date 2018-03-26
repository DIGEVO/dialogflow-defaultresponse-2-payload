'use strict';

const _ = require('lodash');
const rp = require('request-promise-native');

const request = require('request');

const format = require('string-format');
require('dotenv').config();

format.extend(String.prototype, {});

rp
	.get(process.env.URL, { 'auth': { 'bearer': process.env.TOKEN } })
	.then(data => {//
		JSON.parse(data)
			//.filter(o => o.name == '1. Llamada inicial AppBot')
			.forEach(o => {
				getIntent(o.id).then(idata => {
					const intent = JSON.parse(idata);

					//	console.log(JSON.stringify(intent, undefined, 2));

					// //	if (Array.isArray(intent.responses[0].messages.filter(m => m.type == 0)[0].speech)) {
					console.log(intent.id);
					console.log(intent.name);

					// const messages = intent.responses.reduce((acc, r) => {
					// 	return acc.concat(r.messages.filter(m => m.type == 0));
					// }, []);

					const messages = _.flatMap(intent.responses, r => r.messages);

					const combinations = messages.reduce((acc, o) => {
						const speech = [].concat(o.speech);
						const partial = _.flatMap(acc, s1 => {
							return speech.map(s2 => {
								if (s1 && s2) return `${s1} ${s2}`;
								if (s1) return s1;
								return s2;
							})
						});

						return partial;
					}, ['']);

					const payload = { type: 4, payload: { output: combinations }, lang: 'es' };
					intent.responses[0].messages = intent.responses[0].messages.filter(m => m.type != 4);
					intent.responses[0].messages.push(payload);

					updateIntent(intent);
				});
			});
	})
	.catch(console.error);
//arr[Math.trunc(Math.random()*arr.length)]

function getIntent(id) {
	return rp.get(process.env.URL_ID.format(id), { 'auth': { 'bearer': process.env.TOKEN } });
}

function updateIntent(intent) {
	const options = {
		uri: process.env.URL_ID.format(intent.id),
		headers: {
			'Authorization': `Bearer ${process.env.TOKEN}`,
			'Content-Type': ' application/json; charset=utf-8'
		},
		json: true,
		method: 'PUT',
		body: intent
	};

	rp(options).then(data => {
		console.log(JSON.stringify(data, undefined, 2));
	}).catch(e => {
		console.error(JSON.stringify(e));
		console.error('------------------------ error');
	});
}