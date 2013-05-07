var util = require('util');

exports.mod = function(context)
{
	this.streams =
	{
		urgent: process.stdout,
		out: process.stdout,
		err: process.stderr,
		verbose: null,
	};

	this.core$cmd = function(server, prefix, target, command, params)
	{
		if(command === 'log')
		{
			if(typeof this.data.targets !== 'object') this.data.targets = {};

			switch(params[0])
			{
				case '+':
					this.data.targets[params[1]] = true;
					server.send('PRIVMSG ' + target + ' :done');
					break;
				case '-':
					delete this.data.targets[params[1]];
					server.send('PRIVMSG ' + target + ' :done');
					break;
				case '?':
					break;
			}
		}
	}

	this.$log = function(data, stream)
	{
		this.log(data, stream)
	}

	this._logTargets = function(server, data)
	{
		var dataSafe = util.inspect(data);

		if(typeof this.data.targets !== 'undefined')
		{
			for(var kTarget in this.data.targets)
			{
				if(this.data.targets[kTarget] === true)
				{
					server.send('PRIVMSG ' + kTarget + ' :' + dataSafe);
				}
			}
		}
	}

	this.log = function(data, stream)
	{
		this.logUnsafe(data, util.inspect(stream));
	}

	this.logUnsafe = function(data, stream)
	{
		var d = new Date();
		var t = '[' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ']';

		if(typeof this.streams[stream] === 'undefined') stream = 'out';

		if(this.streams[stream] !== null)
		{
			this.streams[stream].write(t + ' ' + data + '\n');
		}
	}
}