import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class SkipCommand extends Command {
  readonly name = "shuffle";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("キュー内の曲をシャッフルして再生します");
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      const song = await this.distube.getQueue(interaction);
      if (song) {
        await this.distube.shuffle(interaction);
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#6fa8dc")
              .setTitle(`🔀 | キュー内の曲をシャッフルしました`)
              .setDescription(`再度シャッフルする場合は、\`/shuffle\`を使用してください。`)
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
              .setTitle(`❌ | シャッフルモードを有効にできません`)
              .setDescription(`キュー内に少なくとも複数の曲が追加されている必要があります。`)
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
