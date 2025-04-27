const { Client, GatewayIntentBits, Events, REST, Routes, ApplicationCommandType, MessageFlags, ContainerBuilder, MediaGalleryItemBuilder, MediaGalleryBuilder, AttachmentBuilder, TextDisplayBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, SeparatorBuilder, FileBuilder } = require('discord.js');

process.loadEnvFile();

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error('No token provided. Please set the TOKEN environment variable.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const rest = new REST({ version: "10" })
    .setToken(TOKEN);

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);

    rest.put(Routes.applicationCommands(client.user.id), {
        body: [
            {
                name: "demo",
                type: ApplicationCommandType.ChatInput,
                description: "Demo command"
            }
        ]
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;

    switch (command) {
        case "demo": {
            const BannerHeader = new AttachmentBuilder("./files/banner-header.png");
            const ComponentsHero = new AttachmentBuilder("./files/components-hero.png");
            const MessageData = new AttachmentBuilder("./files/message-data.json");

            await interaction.reply({
                components: [
                    new ContainerBuilder()
                        .addMediaGalleryComponents(
                            new MediaGalleryBuilder()
                                .addItems(
                                    new MediaGalleryItemBuilder()
                                        .setURL("attachment://banner-header.png")
                                )
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent("## Introducing New Components for Messages!\nWe're bringing new components to messages that you can use in your apps. They allow you to have full control over the layout of your messages.\n\nOur previous components system, while functional, had limitations:\n- Content, attachments, embeds, and components had to follow fixed positioning rules\n- Visual styling options were limited\n\nOur new component system addresses these challenges with fully composable components that can be arranged and laid out in any order, allowing for a more flexible and visually appealing design. Check out the [changelog](https://discord.com/developers/docs/change-log) for more details.")
                        )
                        .addMediaGalleryComponents(
                            new MediaGalleryBuilder()
                                .addItems(
                                    new MediaGalleryItemBuilder()
                                        .setURL("attachment://components-hero.png")
                                )
                        )
                        .addSectionComponents(
                            new SectionBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent("A brief overview of components:")
                                )
                                .setButtonAccessory(
                                    new ButtonBuilder()
                                        .setLabel("Overview")
                                        .setURL("https://discord.com/developers/docs/components/overview")
                                        .setStyle(ButtonStyle.Link)
                                ),
                            new SectionBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent("A list of all the components:")
                                )
                                .setButtonAccessory(
                                    new ButtonBuilder()
                                        .setLabel("Reference")
                                        .setURL("https://discord.com/developers/docs/components/reference#what-is-a-component-component-types")
                                        .setStyle(ButtonStyle.Link)
                                ),
                            new SectionBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent("Get started with message components:")
                                )
                                .setButtonAccessory(
                                    new ButtonBuilder()
                                        .setLabel("Guide")
                                        .setURL("https://discord.com/developers/docs/components/using-message-components")
                                        .setStyle(ButtonStyle.Link)
                                )
                        )
                        .addSeparatorComponents(
                            new SeparatorBuilder()
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent("-# This message was composed using components, check out the request:")
                        )
                        .addFileComponents(
                            new FileBuilder()
                                .setURL("attachment://message-data.json")
                        )
                ],
                flags: [
                    MessageFlags.IsComponentsV2
                ],
                files: [
                    BannerHeader,
                    ComponentsHero,
                    MessageData
                ]
            })
            break;
        }
    }
});

client.login(TOKEN);