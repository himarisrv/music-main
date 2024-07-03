import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class StopCommand extends Command {
  readonly name = "stop";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder().setName("stop").setDescription("再生を停止しVCから切断します");
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    try {
      await this.distube.stop(interaction);
      await this.distube.voices.leave(interaction.guild);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#6fa8dc")
            .setTitle(`⏹️ | 再生を終了しました`)
            .setDescription(`VCから切断しました。再度曲を再生する場合は\`/play\`で曲を登録してください。`)
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
