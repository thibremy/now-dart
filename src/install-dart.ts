import execa from "execa";

async function downloadDartToolchain(version: string = "stable") {
	console.log("downloading the dart toolchain");

	try {
		
	} catch (err) {
		throw new Error(`Failed to install dart: ${err.message}`);
	}
}

export const installDartAndFriends = async (version?: string) => {
	await downloadDartToolchain(version);
};

