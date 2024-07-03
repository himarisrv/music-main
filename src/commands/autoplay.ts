import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class AutoplayCommand extends Command {
  readonly name = "autoplay";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder().setName("autoplay").setDescription("自動再生を切り替えます");
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#6fa8dc")
            .setTitle(`🔃 | 自動再生を ${this.distube.toggleAutoplay(interaction) ? "オン" : "オフ"} に設定しました`)
            .setDescription(`自動再生を再度設定する場合は\`/autoplay\`でオン・オフを切り替えることができます。`)
            .setTimestamp()
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
