import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class SeekCommand extends Command {
  readonly name = "resume";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("一時停止されている曲を再開します");
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      const song = await this.distube.getQueue(interaction);
      if (!song) return;
      const song_data = song.songs[0];

      if (song?.paused) {
        await this.distube.resume(interaction);
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#6fa8dc")
              .setTitle(`:arrow_forward: | 停止中の曲を再開しました`)
              .setDescription(`一時停止中の曲を再開しました。`)
              .addFields({
                name: "現在再生中の曲",
                value: `${song_data.name} - \`${song.formattedCurrentTime}\` : \`${song.formattedDuration}\``,
              })
              .setTimestamp()
              .setAuthor({
                name: `${interaction.client.user.displayName}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              }),
          ],
        });
      } else {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#e06666")
              .setTitle(`❌ | 曲が再生中です`)
              .setDescription(`このコマンドはキューが一時停止の場合に使用できます。`)
              .setTimestamp()
              .setAuthor({
                name: `${interaction.client.user.displayName}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              }),
          ],
        });
      }
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
