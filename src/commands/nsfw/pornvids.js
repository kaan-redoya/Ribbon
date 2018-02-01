/*
 *   This file is part of Ribbon
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
 *       * Requiring preservation of specified reasonable legal notices or
 *         author attributions in that material or in the Appropriate Legal
 *         Notices displayed by works containing it.
 *       * Prohibiting misrepresentation of the origin of that material,
 *         or requiring that modified versions of such material be marked in
 *         reasonable ways as different from the original version.
 */

const Discord = require('discord.js'),
	Pornsearch = require('pornsearch').default,
	commando = require('discord.js-commando'),
	random = require('node-random');

const pornEmbed = new Discord.MessageEmbed(); // eslint-disable-line one-var

module.exports = class pornvidsCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'pornvids',
			'memberName': 'pornvids',
			'group': 'nsfw',
			'aliases': ['porn', 'nsfwvids'],
			'description': 'Search porn videos',
			'format': 'NSFWToLookUp',
			'examples': ['pornvids babe'],
			'guildOnly': false,
			'nsfw': true,
			'throttling': {
				'usages': 2,
				'duration': 3
			},
			'args': [
				{
					'key': 'pornInput',
					'prompt': 'What pornography do you want to find?',
					'type': 'string'
				}
			]
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get(msg.guild, 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	async run (msg, args) {
		const search = new Pornsearch(args.pornInput),
			vids = await search.videos();

		if (vids) {
			random.integers({
				'number': 1,
				'minimum': 0,
				'maximum': vids.length - 1
			}, (error, vid) => {
				if (error) {
					return msg.reply('⚠ An error occured while drawing a random number.');
				}
				pornEmbed
					.setURL(vids[vid].url)
					.setTitle(vids[vid].title)
					.setImage(vids[vid].thumb)
					.setColor('#E24141')
					.addField('Porn video URL', `[Click Here](${vids[vid].url})`, true)
					.addField('Porn video duration', vids[vid].duration === !'' ? vids[vid].url : 'unknown', true);

				this.deleteCommandMessages(msg);
				
				return msg.embed(pornEmbed, vids[vid].url);
			});
		}
	}
};