import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class RemoveCommand extends Command {
  readonly name = "remove";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("指定した曲をキューから削除します")
    .addIntegerOption(option => option.setName("position").setDescription("削除する曲の位置").setRequired(true));
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      const position = interaction.options.getInteger("position", true);
      console.log(position);
      const queue = await this.distube.getQueue(interaction);
      if (!queue || queue.songs.length <= position || position < 0) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#e06666")
              .setTitle(`🚧 | エラーが発生しました`)
              .setDescription(`削除位置が範囲外です。\'/queue\'で現在のキューを確認できます。`)
              .setTimestamp()
              .setAuthor({
                name: `${interaction.client.user.displayName}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              }),
          ],
        });
        return;
      }
      const data = queue.songs[position];
      queue.songs.splice(position, 1);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#6fa8dc")
            .setTitle(`🗑️ | キュー内の曲を削除しました`)
            .setTimestamp()
            .addFields({ name: "削除した曲", value: `${data?.name} - \'${data?.formattedDuration}\'` })
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
