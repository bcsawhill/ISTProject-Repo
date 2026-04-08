export default function getGitHubToken(kolkrabbi) {
    return kolkrabbi.getAccount().then((account) => account.github.token, () => {
        throw new Error('Account not connected to GitHub.');
    });
}
