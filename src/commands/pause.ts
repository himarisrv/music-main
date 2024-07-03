import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class SeekCommand extends Command {
  readonly name = "pause";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder().setName("pause").setDescription("現在の曲を一時停止します");
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      const song = await this.distube.getQueue(interaction);
      if (!song) return;
      const song_data = song.songs[0];
      if (!song.paused) {
        await this.distube.pause(interaction);

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#6fa8dc")
              .setTitle(`⏸️ | 現在の曲を一時停止しました`)
              .setDescription(`再生されている曲を一時停止しました。\`/resume\`で再開します。`)
              .addFields({
                name: "現在停止中の曲",
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
              .setTitle(`❌ | 曲が停止中です`)
              .setDescription(`このコマンドはキューが再生中の場合に使用できます。`)
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
