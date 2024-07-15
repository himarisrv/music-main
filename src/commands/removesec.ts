import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class RemoveCommand extends Command {
  readonly name = "removesec";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("removesec")
    .setDescription("指定した区間内の曲をすべてキューから削除します")
    .addIntegerOption(option => option.setName("start").setDescription("開始位置").setRequired(true))
    .addIntegerOption(option => option.setName("end").setDescription("終了位置").setRequired(true));
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      const start = interaction.options.getInteger("start", true);
      const end = interaction.options.getInteger("end", true);
      const queue = await this.distube.getQueue(interaction);
      if (!queue || queue.songs.length <= end || start < 0 || end < start) {
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
      // startからendまでの曲を削除
      queue.songs.splice(start, end - start + 1);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#6fa8dc")
            .setTitle(`🗑️ | キュー内の曲を削除しました`)
            .setTimestamp()
            .addFields({ name: "削除した曲", value: `位置 ${start} から ${end} までの曲` })
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
