module.exports = {
    isMod: (interaction) => {
        const modRoles = [
            "1404873533951312024",
            "1405102488775823430",
            "1406025210527879238"
        ];
        return interaction.member.roles.cache.some(r => modRoles.includes(r.id));
    }
};
