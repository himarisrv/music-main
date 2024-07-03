import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class SeekCommand extends Command {
  readonly name = "seek";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("seek")
    .setDescription("現在の再生中の曲を指定された秒数から再生します")
    .addNumberOption(option => option.setName("time").setDescription("開始秒数").setMinValue(0).setRequired(true));
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const time = interaction.options.getNumber("time", true);
    this.distube.seek(interaction, time);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#6fa8dc")
          .setTitle(`⏱️ | 指定位置から開始しました`)
          .setDescription(`現在再生中の曲を${time}秒から再生しています`)
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.displayName}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          }),
      ],
    });
  }
}
