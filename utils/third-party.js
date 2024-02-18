const figlet = require("figlet");
const cliProgress = require("cli-progress");
const { SingleBar } = require("cli-progress");

async function figletAsync(text) {
    return new Promise((resolve, reject) => {
        figlet(text, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

const progressBar = new SingleBar(
    {
        stopOnComplete: true,
    },
    cliProgress.Presets.shades_classic
);

module.exports = {
    figletAsync,
    progressBar,
};
