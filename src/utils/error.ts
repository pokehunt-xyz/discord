export class APIError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class IgnoreError extends Error {
	constructor() {
		super('Wrong user pressed the button');
	}
}

export class CustomError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidOptionError extends Error {
	constructor(option: string, restriction?: string) {
		if (!restriction) super(`Your input for the option **${option}** was wrong, please try again.`);
		else super(`Your input for the option **${option}** violated the restriction ${restriction}, please try again.`);
	}
}

export class OnlyInGuildError extends Error {
	constructor() {
		super(`You can only run this command in a server (text channel)!`);
	}
}

export class UnknownError extends Error {
	constructor(identifier: string, error: Error) {
		super(`An unknown error occurred at ${identifier}. ${error?.message ?? error}`);
	}
}

// Unique for Discord client
export class NoPermissionError extends Error {
	constructor() {
		super('You do not have enough permissions to do that.');
	}
}
