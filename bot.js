const { ActionRowBuilder } = require('@discordjs/builders');
const { Client, GatewayIntentBits, Events, REST, Routes, MessageFlags, ContainerBuilder, MediaGalleryItemBuilder, MediaGalleryBuilder, AttachmentBuilder, TextDisplayBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, SeparatorBuilder, FileBuilder, Collection, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

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

    const commands = new Collection();

    commands.set("demo",
        new SlashCommandBuilder()
            .setName("demo")
            .setDescription("Demo command")
            .addStringOption(
                option => option
                    .setName("type")
                    .setDescription("Type of demo")
                    .setRequired(false)
                    .addChoices(
                        { name: "Food Selection", value: "food" },
                        { name: "File Build", value: "file" },
                        { name: "Image Gallery", value: "image" },
                    )
            )
    )

    rest.put(Routes.applicationCommands(client.user.id), {
        body: commands
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;

    const type = interaction.options.getString("type");

    switch (command) {
        case "demo": {
            if (!type) {
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
                        new AttachmentBuilder("./files/banner-header.png"),
                        new AttachmentBuilder("./files/components-hero.png"),
                        new AttachmentBuilder("./files/message-data.json")
                    ]
                });
            } else {
                switch (type) {
                    case "food": {
                        await interaction.reply({
                            components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new StringSelectMenuBuilder()
                                            .setPlaceholder("Make a selection")
                                            .setCustomId("food-selection")
                                            .addOptions(
                                                new StringSelectMenuOptionBuilder()
                                                    .setEmoji("🌮")
                                                    .setLabel("Taco")
                                                    .setDescription("(best option)")
                                                    .setValue("taco"),
                                                new StringSelectMenuOptionBuilder()
                                                    .setEmoji("🍕")
                                                    .setLabel("Pizza")
                                                    .setValue("pizza"),
                                                new StringSelectMenuOptionBuilder()
                                                    .setEmoji("🍔")
                                                    .setLabel("Burger")
                                                    .setValue("burger"),
                                            )
                                    )
                            ],
                            flags: [
                                MessageFlags.IsComponentsV2
                            ]
                        });
                        break;
                    };
                    case "file": {
                        await interaction.reply({
                            components: [
                                new TextDisplayBuilder()
                                    .setContent("# Test out Build 17\nInstall the latest update to test new features!"),
                                new FileBuilder()
                                    .setURL("attachment://game.zip"),
                                new TextDisplayBuilder()
                                    .setContent("Get instructions and details on all of the changes"),
                                new FileBuilder()
                                    .setURL("attachment://manual.pdf")
                            ],
                            files: [
                                new AttachmentBuilder("./files/game.zip"),
                                new AttachmentBuilder("./files/manual.pdf")
                            ],
                            flags: [
                                MessageFlags.IsComponentsV2
                            ]
                        });
                        break;
                    };
                    case "image": {
                        await interaction.reply({
                            components: [
                                new TextDisplayBuilder()
                                    .setContent("Live webcam updateds as of 12:28:03 PM PST"),
                                new MediaGalleryBuilder()
                                    .addItems(
                                        new MediaGalleryItemBuilder()
                                            .setURL("attachment://images-01.jpg"),
                                        new MediaGalleryItemBuilder()
                                            .setURL("attachment://images-02.jpg"),
                                        new MediaGalleryItemBuilder()
                                            .setURL("attachment://images-03.jpeg")
                                    )
                            ],
                            files: [
                                new AttachmentBuilder("./files/images-01.jpg"),
                                new AttachmentBuilder("./files/images-02.jpg"),
                                new AttachmentBuilder("./files/images-03.jpeg"),
                            ],
                            flags: [
                                MessageFlags.IsComponentsV2
                            ]
                        })
                        break;
                    }
                }
            }
            break;
        }
    }
});

client.login(TOKEN);