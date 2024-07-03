import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class SeekCommand extends Command {
  readonly name = "loop";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("loop")
    .setDescription("ループモードを設定します")
    .addStringOption(option =>
      option
        .setName("loop")
        .setDescription("ループモードを選択")
        .setRequired(true)
        .addChoices(
          { name: "⏹️ ループなし", value: "none" },
          { name: "🔂 現在の曲をループ", value: "current" },
          { name: "🔁 キュー全体をループ", value: "queue" },
        ),
    );
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      const mode = interaction.options.getString("loop");
      const queue = this.distube.getQueue(interaction);
      if (!queue) return;
      if (mode === "none") {
        if (queue.repeatMode === 0) {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#e06666")
                .setTitle(`⏹️ | 既に「ループなし」モードが有効になっています`)
                .setDescription(`ループモードを設定する場合は\`/loop\`でモードを設定できます。`)
                .setTimestamp()
                .setAuthor({
                  name: `${interaction.client.user.displayName}`,
                  iconURL: `${interaction.client.user.displayAvatarURL()}`,
                }),
            ],
          });
        } else {
          await this.distube.setRepeatMode(interaction, 0);
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#6fa8dc")
                .setTitle(`⏹️ | 「ループなし」モードに設定しました`)
                .setDescription(
                  `現在キューにある曲を順番に再生します。\nループモードを設定する場合は\`/loop\`でモードを設定できます。`,
                )
                .setTimestamp()
                .setAuthor({
                  name: `${interaction.client.user.displayName}`,
                  iconURL: `${interaction.client.user.displayAvatarURL()}`,
                }),
            ],
          });
        }
      } else if (mode === "current") {
        if (queue.repeatMode === 1) {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#e06666")
                .setTitle(`🔂 | 既に「現在の曲のループ」モードが有効になっています`)
                .setDescription(`ループモードを設定する場合は\`/loop\`でモードを設定できます。`)
                .setTimestamp()
                .setAuthor({
                  name: `${interaction.client.user.displayName}`,
                  iconURL: `${interaction.client.user.displayAvatarURL()}`,
                }),
            ],
          });
        } else {
          await this.distube.setRepeatMode(interaction, 1);
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#6fa8dc")
                .setTitle(`🔂 | 「現在の曲をループ」モードに設定しました`)
                .setDescription(
                  `現在再生中の曲をループ再生します。\nループモードを設定する場合は\`/loop\`でモードを設定できます。`,
                )
                .setTimestamp()
                .setAuthor({
                  name: `${interaction.client.user.displayName}`,
                  iconURL: `${interaction.client.user.displayAvatarURL()}`,
                }),
            ],
          });
        }
      } else if (mode === "queue") {
        if (queue.repeatMode === 2) {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#e06666")
                .setTitle(`🔁 | 既に「キュー全体をループ」モードが有効になっています`)
                .setDescription(`ループモードを設定する場合は\`/loop\`でモードを設定できます。`)
                .setTimestamp()
                .setAuthor({
                  name: `${interaction.client.user.displayName}`,
                  iconURL: `${interaction.client.user.displayAvatarURL()}`,
                }),
            ],
          });
        } else {
          await this.distube.setRepeatMode(interaction, 2);
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#6fa8dc")
                .setTitle(`🔁 | 「キュー全体をループ」モードに設定しました`)
                .setDescription(
                  `キュー内全体をループ再生します。\nループモードを設定する場合は\`/loop\`でモードを設定できます。`,
                )
                .setTimestamp()
                .setAuthor({
                  name: `${interaction.client.user.displayName}`,
                  iconURL: `${interaction.client.user.displayAvatarURL()}`,
                }),
            ],
          });
        }
      }
    } catch (e) {
      console.log(e);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#e06666")
            .setTitle(`🚧 | エラーが発生しました`)
            .setDescription(`次のエラーが発生しました。\n \`\`\`${e}\`\`\``)
            .setTimestamp()
            .setAuthor({
              name: `${interaction.client.user.displayName}`,
              iconURL: `${interaction.client.user.displayAvatarURL()}`,
            }),
        ],
      });
    }
  }
}
