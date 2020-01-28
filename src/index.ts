import { installDartAndFriends } from './install-dart';


export const version = process.env.RUNTIME_NAME ? 3 : 1;

export async function build() {
	console.log("preparing build...");
	await installDartAndFriends();
}

export async function prepareCache() {
	console.log("preparing cache...");
}

export { shouldServe } from "@now/build-utils";
