import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class SkipToCommand extends Command {
  readonly name = "skipto";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("指定した曲までスキップします")
    .addIntegerOption(option => option.setName("position").setDescription("スキップ先の位置").setRequired(true));
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      const position = interaction.options.getInteger("position", true);
      const queue = await this.distube.getQueue(interaction);
      if (!queue || queue.songs.length <= position || position < 0) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#e06666")
              .setTitle(`🚧 | エラーが発生しました`)
              .setDescription(`スキップ位置が範囲外です。\'/queue\'で現在のキューを確認できます。`)
              .setTimestamp()
              .setAuthor({
                name: `${interaction.client.user.displayName}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              }),
          ],
        });
        return;
      }
      const song = await this.distube.jump(interaction, position);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#6fa8dc")
            .setTitle(`⏩ | 現在の曲をスキップしました`)
            .setTimestamp()
            .addFields({ name: "スキップ先", value: `${song.name} - \`${song.formattedDuration}\`` })
            .setAuthor({
              name: `${interaction.client.user.displayName}`,
              iconURL: `${interaction.client.user.displayAvatarURL()}`,
            }),
        ],
      });
    } catch (e) {
      console.error(e);
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
